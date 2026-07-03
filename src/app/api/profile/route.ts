import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validation";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { fullName, email, phone, program, level, hasGhanaCard } = parsed.data;

  const emailTaken = await prisma.user.findFirst({
    where: { email, NOT: { id: session.user.id } },
  });
  if (emailTaken) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName,
      email,
      phone: phone || null,
      program: program || null,
      level: level || null,
      hasGhanaCard: hasGhanaCard ?? false,
    },
  });

  return NextResponse.json({
    ok: true,
    user: {
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      program: updated.program,
      level: updated.level,
      hasGhanaCard: updated.hasGhanaCard,
    },
  });
}
