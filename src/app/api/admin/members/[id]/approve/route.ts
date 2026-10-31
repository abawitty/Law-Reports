import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { computeNextMembershipNumber } from "@/lib/membership-number";
import { sendEmail, loginUrl } from "@/lib/email";
import { approvalEmail } from "@/lib/email-templates";
import { sendSms } from "@/lib/sms";
import { approvalSms } from "@/lib/sms-templates";
import { getPageContent } from "@/lib/content";
import { canGiveFinalApproval, canPartiallyApprove } from "@/lib/constants";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  const role = check.session.user.role;
  if (!canPartiallyApprove(role)) {
    return NextResponse.json(
      { error: "You don't have permission to approve members" },
      { status: 403 },
    );
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

  // The Vice President (or anyone who can only partially approve) can mark
  // a pending application as reviewed, but it stays short of a membership
  // number — and therefore short of unlocking the member's dashboard —
  // until the President (or Admin) gives final approval.
  if (!canGiveFinalApproval(role)) {
    if (user.approvalStatus === "PARTIALLY_APPROVED") {
      return NextResponse.json(
        { error: "Already partially approved — awaiting the President's final approval" },
        { status: 400 },
      );
    }
    await prisma.user.update({
      where: { id },
      data: { approvalStatus: "PARTIALLY_APPROVED" },
    });
    return NextResponse.json({ ok: true, partial: true });
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
  if (user.phone) {
    await sendSms({ to: user.phone, message: approvalSms(membershipNumber, loginUrl()) });
  }

  return NextResponse.json({ ok: true, membershipNumber });
}
