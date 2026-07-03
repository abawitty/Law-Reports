import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { fullName, studentId, email, phone, program, level, hasGhanaCard, password } =
    parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ studentId }, { email }] },
  });
  if (existing) {
    return NextResponse.json(
      {
        error:
          existing.studentId === studentId
            ? "An account with this Student ID already exists"
            : "An account with this email already exists",
      },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      fullName,
      studentId,
      email,
      phone: phone || null,
      program: program || null,
      level: level || null,
      hasGhanaCard: hasGhanaCard ?? false,
      passwordHash,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
