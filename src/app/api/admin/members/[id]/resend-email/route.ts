import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { sendEmail, loginUrl } from "@/lib/email";
import { approvalEmail } from "@/lib/email-templates";
import { getPageContent } from "@/lib/content";
import { canManageMemberCredentials } from "@/lib/constants";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageMemberCredentials(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to resend member emails" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  if (!user.membershipNumber) {
    return NextResponse.json(
      { error: "This member hasn't been approved yet — nothing to resend" },
      { status: 400 },
    );
  }
  if (!user.email) {
    return NextResponse.json({ error: "No email on file for this member" }, { status: 400 });
  }

  const emailContent = await getPageContent("emails");
  const { subject, html } = approvalEmail(emailContent, user.fullName, user.membershipNumber, loginUrl());
  const result = await sendEmail({ to: user.email, subject, html });

  if (!result.sent) {
    return NextResponse.json(
      { error: `Email could not be sent: ${result.error ?? "unknown error"}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
