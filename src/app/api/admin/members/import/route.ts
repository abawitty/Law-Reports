import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { generateTempPassword } from "@/lib/generate-password";

type ImportResult = {
  row: number;
  studentId: string;
  fullName: string;
  email: string;
  status: "created" | "skipped";
  reason?: string;
  initialPassword?: string;
};

function cell(record: Record<string, string>, key: string): string {
  return (record[key] ?? "").trim();
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

  const text = await file.text();
  let records: Record<string, string>[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return NextResponse.json({ error: "Could not parse the CSV file" }, { status: 400 });
  }

  if (records.length === 0) {
    return NextResponse.json({ error: "The CSV file has no rows" }, { status: 400 });
  }
  if (records.length > 1000) {
    return NextResponse.json({ error: "Import is limited to 1000 rows at a time" }, { status: 400 });
  }

  const results: ImportResult[] = [];

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const rowNum = i + 2; // account for header row, 1-indexed
    const studentId = cell(r, "studentId");
    const surname = cell(r, "surname");
    const firstName = cell(r, "firstName");
    const email = cell(r, "email");
    const fullName = `${firstName} ${surname}`.trim();

    if (!studentId || !surname || !firstName || !email) {
      results.push({
        row: rowNum,
        studentId,
        fullName,
        email,
        status: "skipped",
        reason: "Missing required field (studentId, surname, firstName, or email)",
      });
      continue;
    }

    const membershipNumber = cell(r, "membershipNumber") || null;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { studentId },
          { email },
          ...(membershipNumber ? [{ membershipNumber }] : []),
        ],
      },
    });
    if (existing) {
      results.push({
        row: rowNum,
        studentId,
        fullName,
        email,
        status: "skipped",
        reason:
          existing.studentId === studentId
            ? "Student ID already exists"
            : existing.email === email
              ? "Email already exists"
              : "Membership number already exists",
      });
      continue;
    }

    const dobRaw = cell(r, "dateOfBirth");
    const dateOfBirth = dobRaw ? new Date(dobRaw) : null;
    const validDob = dateOfBirth && !Number.isNaN(dateOfBirth.getTime()) ? dateOfBirth : null;

    const initialPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    await prisma.user.create({
      data: {
        fullName,
        surname,
        firstName,
        studentId,
        membershipNumber,
        email,
        phone: cell(r, "phone") || null,
        whatsapp: cell(r, "whatsapp") || null,
        program: cell(r, "program") || null,
        level: cell(r, "level") || null,
        faculty: cell(r, "faculty") || null,
        occupation: cell(r, "occupation") || null,
        constituency: cell(r, "constituency") || null,
        sex: cell(r, "sex") || null,
        dateOfBirth: validDob,
        hasVotersId: toBool(cell(r, "hasVotersId")),
        hasGhanaCard: toBool(cell(r, "hasGhanaCard")) ?? false,
        passwordHash,
        mustChangePassword: true,
      },
    });

    results.push({
      row: rowNum,
      studentId,
      fullName,
      email,
      status: "created",
      initialPassword,
    });
  }

  return NextResponse.json({
    ok: true,
    createdCount: results.filter((r) => r.status === "created").length,
    skippedCount: results.filter((r) => r.status === "skipped").length,
    results,
  });
}
