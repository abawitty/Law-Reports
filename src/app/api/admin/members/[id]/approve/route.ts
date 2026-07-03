import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { computeNextMembershipNumber } from "@/lib/membership-number";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  if (user.membershipNumber) {
    return NextResponse.json(
      { error: "This member already has a membership number" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const override = typeof body?.membershipNumber === "string" ? body.membershipNumber.trim() : "";

  const membershipNumber = override || (await computeNextMembershipNumber());

  const clash = await prisma.user.findUnique({ where: { membershipNumber } });
  if (clash) {
    return NextResponse.json(
      { error: `Membership number ${membershipNumber} is already in use` },
      { status: 409 },
    );
  }

  await prisma.user.update({
    where: { id },
    data: { membershipNumber, approvalStatus: "APPROVED" },
  });

  return NextResponse.json({ ok: true, membershipNumber });
}
