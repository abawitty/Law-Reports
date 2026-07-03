import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { generateTempPassword } from "@/lib/generate-password";

// Bulk imports can involve hundreds of rows; give the route more room than
// the framework default before Vercel considers it timed out.
export const maxDuration = 60;

type ImportResult = {
  row: number;
  studentId: string;
  fullName: string;
  email: string | null;
  status: "created" | "skipped";
  reason?: string;
  initialPassword?: string;
};

// Accepts common header variations (case, spacing, punctuation) so a CSV
// exported from Excel/Google Sheets with headers like "Student ID" or
// "Email Address" still maps correctly instead of silently skipping every row.
const FIELD_ALIASES: Record<string, string[]> = {
  studentId: ["studentid", "studentidnumber", "studentno", "studentnumber", "id"],
  membershipNumber: ["membershipnumber", "membershipno", "memberno", "memnumber"],
  surname: ["surname", "lastname"],
  firstName: ["firstname", "givenname"],
  email: ["email", "emailaddress"],
  phone: ["phone", "phonenumber", "mobile", "mobilenumber", "contact", "contactnumber"],
  whatsapp: ["whatsapp", "whatsappnumber"],
  program: ["program", "programme", "course"],
  level: ["level", "year"],
  faculty: ["faculty", "school"],
  occupation: ["occupation"],
  constituency: ["constituency", "constituencyofresidence"],
  sex: ["sex", "gender"],
  dateOfBirth: ["dateofbirth", "dob", "birthdate"],
  hasVotersId: ["hasvotersid", "votersid", "voterid"],
  hasGhanaCard: ["hasghanacard", "ghanacard"],
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildFieldMap(headers: string[]): Record<string, string> {
  const normalized = headers.map((h) => ({ original: h, normalized: normalizeHeader(h) }));
  const map: Record<string, string> = {};
  for (const [canonical, aliases] of Object.entries(FIELD_ALIASES)) {
    const match = normalized.find((h) => aliases.includes(h.normalized));
    if (match) map[canonical] = match.original;
  }
  return map;
}

function cell(record: Record<string, string>, fieldMap: Record<string, string>, key: string): string {
  const column = fieldMap[key];
  if (!column) return "";
  return (record[column] ?? "").trim();
}

function toBool(value: string): boolean | null {
  const v = value.trim().toLowerCase();
  if (v === "yes" || v === "true") return true;
  if (v === "no" || v === "false") return false;
  return null;
}

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
  }

  // Strip a UTF-8 BOM, which Excel adds when saving CSVs and which otherwise
  // corrupts the first header's name (e.g. "﻿studentId").
  const text = (await file.text()).replace(/^﻿/, "");

  let records: Record<string, string>[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true, trim: true, bom: true });
  } catch (e) {
    return NextResponse.json(
      { error: `Could not parse the CSV file: ${e instanceof Error ? e.message : "unknown error"}` },
      { status: 400 },
    );
  }

  if (records.length === 0) {
    return NextResponse.json({ error: "The CSV file has no rows" }, { status: 400 });
  }
  if (records.length > 1000) {
    return NextResponse.json({ error: "Import is limited to 1000 rows at a time" }, { status: 400 });
  }

  const fieldMap = buildFieldMap(Object.keys(records[0]));
  const missingRequired = ["surname", "firstName"].filter((k) => !fieldMap[k]);
  if (!fieldMap.studentId && !fieldMap.membershipNumber) {
    missingRequired.push("studentId or membershipNumber");
  }
  if (missingRequired.length > 0) {
    return NextResponse.json(
      {
        error: `Couldn't find a column for: ${missingRequired.join(", ")}. Check your CSV headers match the template (surname, firstName, and either studentId or membershipNumber are required).`,
      },
      { status: 400 },
    );
  }

  // Pre-fetch every existing studentId/email/membershipNumber in one query
  // instead of one lookup per row — keeps large imports fast enough to
  // finish within the serverless function's time limit.
  const rowsData = records.map((r, i) => {
    const surname = cell(r, fieldMap, "surname");
    const firstName = cell(r, fieldMap, "firstName");
    const email = cell(r, fieldMap, "email") || null;
    const membershipNumber = cell(r, fieldMap, "membershipNumber") || null;
    // Historical records often have no separate Student ID — fall back to
    // the membership number as the login identifier in that case.
    const studentId = cell(r, fieldMap, "studentId") || membershipNumber || "";
    return { rowNum: i + 2, r, studentId, surname, firstName, email, membershipNumber };
  });

  const candidateStudentIds = rowsData.map((d) => d.studentId).filter(Boolean);
  const candidateEmails = rowsData.map((d) => d.email).filter((v): v is string => !!v);
  const candidateMembershipNumbers = rowsData
    .map((d) => d.membershipNumber)
    .filter((v): v is string => !!v);

  const existingUsers = await prisma.user.findMany({
    where: {
      OR: [
        candidateStudentIds.length ? { studentId: { in: candidateStudentIds } } : undefined,
        candidateEmails.length ? { email: { in: candidateEmails } } : undefined,
        candidateMembershipNumbers.length
          ? { membershipNumber: { in: candidateMembershipNumbers } }
          : undefined,
      ].filter((c): c is NonNullable<typeof c> => c !== undefined),
    },
    select: { studentId: true, email: true, membershipNumber: true },
  });
  const existingStudentIds = new Set(existingUsers.map((u) => u.studentId));
  const existingEmails = new Set(existingUsers.map((u) => u.email));
  const existingMembershipNumbers = new Set(
    existingUsers.map((u) => u.membershipNumber).filter((v): v is string => !!v),
  );

  const results: ImportResult[] = [];
  const seenStudentIds = new Set<string>();
  const seenEmails = new Set<string>();
  const seenMembershipNumbers = new Set<string>();
  const toCreate: { row: ImportResult; data: Prisma.UserCreateManyInput }[] = [];

  for (const d of rowsData) {
    const fullName = `${d.firstName} ${d.surname}`.trim();
    const base = { row: d.rowNum, studentId: d.studentId, fullName, email: d.email };

    if (!d.studentId || !d.surname || !d.firstName) {
      results.push({ ...base, status: "skipped", reason: "Missing required field (surname, firstName, or a studentId/membershipNumber)" });
      continue;
    }
    if (existingStudentIds.has(d.studentId) || seenStudentIds.has(d.studentId)) {
      results.push({ ...base, status: "skipped", reason: "Student ID already exists" });
      continue;
    }
    if (d.email && (existingEmails.has(d.email) || seenEmails.has(d.email))) {
      results.push({ ...base, status: "skipped", reason: "Email already exists" });
      continue;
    }
    if (d.membershipNumber && (existingMembershipNumbers.has(d.membershipNumber) || seenMembershipNumbers.has(d.membershipNumber))) {
      results.push({ ...base, status: "skipped", reason: "Membership number already exists" });
      continue;
    }

    seenStudentIds.add(d.studentId);
    if (d.email) seenEmails.add(d.email);
    if (d.membershipNumber) seenMembershipNumbers.add(d.membershipNumber);

    const dobRaw = cell(d.r, fieldMap, "dateOfBirth");
    const dateOfBirth = dobRaw ? new Date(dobRaw) : null;
    const validDob = dateOfBirth && !Number.isNaN(dateOfBirth.getTime()) ? dateOfBirth : null;

    const initialPassword = generateTempPassword();

    toCreate.push({
      row: { ...base, status: "created", initialPassword },
      data: {
        fullName,
        surname: d.surname,
        firstName: d.firstName,
        studentId: d.studentId,
        membershipNumber: d.membershipNumber,
        email: d.email,
        phone: cell(d.r, fieldMap, "phone") || null,
        whatsapp: cell(d.r, fieldMap, "whatsapp") || null,
        program: cell(d.r, fieldMap, "program") || null,
        level: cell(d.r, fieldMap, "level") || null,
        faculty: cell(d.r, fieldMap, "faculty") || null,
        occupation: cell(d.r, fieldMap, "occupation") || null,
        constituency: cell(d.r, fieldMap, "constituency") || null,
        sex: cell(d.r, fieldMap, "sex") || null,
        dateOfBirth: validDob,
        hasVotersId: toBool(cell(d.r, fieldMap, "hasVotersId")),
        hasGhanaCard: toBool(cell(d.r, fieldMap, "hasGhanaCard")) ?? false,
        passwordHash: "", // filled in below once hashed
        mustChangePassword: true,
      },
    });
  }

  // Hash passwords concurrently (CPU-bound, not I/O-bound — safe to
  // parallelize) rather than one at a time in the row loop. Cost factor 8
  // (vs. the standard 10 used for real user-chosen passwords) trades a
  // little hashing strength for import speed — reasonable here since these
  // are single-use temporary passwords the member must replace on first
  // login, not long-lived credentials.
  await Promise.all(
    toCreate.map(async (item) => {
      item.data.passwordHash = await bcrypt.hash(item.row.initialPassword!, 8);
    }),
  );

  if (toCreate.length > 0) {
    await prisma.user.createMany({
      data: toCreate.map((item) => item.data),
      skipDuplicates: true,
    });
  }

  for (const item of toCreate) results.push(item.row);
  results.sort((a, b) => a.row - b.row);

  return NextResponse.json({
    ok: true,
    createdCount: results.filter((r) => r.status === "created").length,
    skippedCount: results.filter((r) => r.status === "skipped").length,
    results,
  });
}
