import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { computeNextMembershipNumber } from "@/lib/membership-number";
import { sendEmail, loginUrl } from "@/lib/email";
import { approvalEmail } from "@/lib/email-templates";
import { getPageContent } from "@/lib/content";

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

  const issuedAtRaw = typeof body?.issuedAt === "string" ? body.issuedAt.trim() : "";
  const parsedIssuedAt = issuedAtRaw ? new Date(issuedAtRaw) : null;
  const membershipIssuedAt =
    parsedIssuedAt && !Number.isNaN(parsedIssuedAt.getTime()) ? parsedIssuedAt : new Date();

  await prisma.user.update({
    where: { id },
    data: { membershipNumber, membershipIssuedAt, approvalStatus: "APPROVED" },
  });

  if (user.email) {
    const emailContent = await getPageContent("emails");
    const { subject, html } = approvalEmail(emailContent, user.fullName, membershipNumber, loginUrl());
    await sendEmail({ to: user.email, subject, html });
  }

  return NextResponse.json({ ok: true, membershipNumber });
}
