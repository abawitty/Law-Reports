import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "TEIN-KUC <onboarding@resend.dev>";

// No-ops (and logs) instead of throwing when RESEND_API_KEY isn't configured
// yet, so the app keeps working — approving/importing members never fails
// because of email delivery.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean }> {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipped email "${subject}" to ${to}`);
    return { sent: false };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return { sent: true };
  } catch (e) {
    console.error(`Failed to send email "${subject}" to ${to}:`, e);
    return { sent: false };
  }
}

export function loginUrl(): string {
  return `${process.env.SITE_URL || "https://www.teinkuc.online"}/membership/login`;
}
