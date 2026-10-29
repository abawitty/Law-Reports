import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { sendEmail, loginUrl } from "@/lib/email";
import { approvalEmail } from "@/lib/email-templates";

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
  if (!user.membershipNumber) {
    return NextResponse.json(
      { error: "This member hasn't been approved yet — nothing to resend" },
      { status: 400 },
    );
  }
  if (!user.email) {
    return NextResponse.json({ error: "No email on file for this member" }, { status: 400 });
  }

  const { subject, html } = approvalEmail(user.fullName, user.membershipNumber, loginUrl());
  const result = await sendEmail({ to: user.email, subject, html });

  if (!result.sent) {
    return NextResponse.json({ error: "Email could not be sent — check server logs" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
