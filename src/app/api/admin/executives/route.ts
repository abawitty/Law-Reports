import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { generateTempPassword } from "@/lib/generate-password";
import { canManageExecutiveAccounts, ROLES, type Role } from "@/lib/constants";

const CREATABLE_ROLES: Role[] = ["SECRETARY", "VICE_PRESIDENT", "PRESIDENT"];

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageExecutiveAccounts(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to create executive accounts" },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const studentId = typeof body?.studentId === "string" ? body.studentId.trim() : "";
  const role = typeof body?.role === "string" ? body.role : "";

  if (!fullName) {
    return NextResponse.json({ error: "Enter the officer's full name" }, { status: 400 });
  }
  if (!studentId) {
    return NextResponse.json({ error: "Enter a Member ID for this account" }, { status: 400 });
  }
  if (!ROLES.includes(role as Role) || !CREATABLE_ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Choose a valid role" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { studentId } });
  if (existing) {
    return NextResponse.json({ error: "That Member ID is already in use" }, { status: 409 });
  }

  const initialPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  await prisma.user.create({
    data: {
      fullName,
      studentId,
      role: role as Role,
      approvalStatus: "APPROVED",
      passwordHash,
      mustChangePassword: true,
    },
  });

  return NextResponse.json({ ok: true, studentId, initialPassword });
}
