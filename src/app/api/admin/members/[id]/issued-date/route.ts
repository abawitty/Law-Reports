import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  if (!user.membershipNumber) {
    return NextResponse.json(
      { error: "This member hasn't been approved yet — nothing to set a date for" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const raw = typeof body?.issuedAt === "string" ? body.issuedAt.trim() : "";
  const parsed = raw ? new Date(raw) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return NextResponse.json({ error: "Enter a valid month and year" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: { membershipIssuedAt: parsed },
  });

  return NextResponse.json({ ok: true });
}
