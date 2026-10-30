import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { generateTempPassword } from "@/lib/generate-password";
import { sendEmail, loginUrl } from "@/lib/email";
import { importWelcomeEmail } from "@/lib/email-templates";
import { getPageContent } from "@/lib/content";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
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

  return NextResponse.json({ ok: true, newPassword, emailed, emailError });
}
