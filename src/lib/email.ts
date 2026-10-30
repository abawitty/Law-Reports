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
}): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipped email "${subject}" to ${to}`);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    // The SDK resolves successfully even when Resend rejects the request
    // (bad from-address, unverified domain, rate limit, etc.) — it reports
    // that as { error } in the response rather than throwing, so that has
    // to be checked explicitly or a rejected send looks identical to a sent one.
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error(`Resend rejected email "${subject}" to ${to}:`, error);
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (e) {
    console.error(`Failed to send email "${subject}" to ${to}:`, e);
    return { sent: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function loginUrl(): string {
  return `${process.env.SITE_URL || "https://www.teinkuc.online"}/membership/login`;
}
