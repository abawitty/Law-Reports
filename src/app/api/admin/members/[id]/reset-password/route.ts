import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { generateTempPassword } from "@/lib/generate-password";
import { sendEmail, loginUrl } from "@/lib/email";
import { importWelcomeEmail } from "@/lib/email-templates";
import { sendSms } from "@/lib/sms";
import { credentialsSms } from "@/lib/sms-templates";
import { getPageContent } from "@/lib/content";
import { canManageMemberCredentials } from "@/lib/constants";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageMemberCredentials(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to reset member passwords" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const newPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { passwordHash, mustChangePassword: true },
  });

  let emailed = false;
  let emailError: string | undefined;
  if (user.email) {
    const emailContent = await getPageContent("emails");
    const { subject, html } = importWelcomeEmail(
      emailContent,
      user.fullName,
      user.studentId,
      user.membershipNumber,
      newPassword,
      loginUrl(),
    );
    const result = await sendEmail({ to: user.email, subject, html });
    emailed = result.sent;
    emailError = result.error;
  }

  let smsSent = false;
  let smsError: string | undefined;
  if (user.phone) {
    const message = credentialsSms(user.studentId, user.membershipNumber, newPassword, loginUrl());
    const result = await sendSms({ to: user.phone, message });
    smsSent = result.sent;
    smsError = result.error;
  }

  return NextResponse.json({ ok: true, newPassword, emailed, emailError, smsSent, smsError });
}
