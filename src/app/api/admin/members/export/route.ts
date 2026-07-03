import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    "fullName",
    "surname",
    "firstName",
    "email",
    "studentId",
    "phone",
    "whatsapp",
    "dateOfBirth",
    "sex",
    "occupation",
    "faculty",
    "program",
    "level",
    "constituency",
    "hasVotersId",
    "hasGhanaCard",
    "signature",
    "role",
    "createdAt",
  ] as const;

  const header = columns.join(",");
  const rows = users.map((u) => columns.map((c) => csvEscape(u[c])).join(","));
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="teinkuc-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
