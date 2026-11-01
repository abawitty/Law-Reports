const MNOTIFY_API_KEY = process.env.MNOTIFY_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || "TEINKUC";

// Members type their phone number however they like at registration (local
// 0XX..., +233XX..., spaces/dashes) — mNotify expects it as 233XXXXXXXXX,
// so normalize here rather than forcing a format on the registration form.
function toMnotifyRecipient(phone: string): string | null {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10 && digits.startsWith("0")) return `233${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("233")) return digits;
  if (digits.length === 9) return `233${digits}`;
  return null;
}

// No-ops (and logs) instead of throwing when MNOTIFY_API_KEY isn't
// configured yet, so the app keeps working — approving/importing/resetting
// members never fails because of SMS delivery. Mirrors sendEmail in
// src/lib/email.ts.
export async function sendSms({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!MNOTIFY_API_KEY) {
    console.warn(`MNOTIFY_API_KEY not set — skipped SMS to ${to}`);
    return { sent: false, error: "MNOTIFY_API_KEY not configured" };
  }
  const recipient = toMnotifyRecipient(to);
  if (!recipient) {
    console.warn(`Not a recognizable Ghana phone number — skipped SMS to "${to}"`);
    return { sent: false, error: "Unrecognized phone number format" };
  }
  try {
    const res = await fetch(
      `https://api.mnotify.com/api/sms/quick?key=${encodeURIComponent(MNOTIFY_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: [recipient],
          sender: SENDER_ID,
          message,
          is_schedule: "false",
          schedule_date: "",
        }),
      },
    );
    const data = await res.json().catch(() => ({}));
    // mNotify resolves with an HTTP response even when it rejects the
    // request (bad sender ID, insufficient balance, etc.) — that's reported
    // as a non-success code/status in the body, not an HTTP error, so it
    // has to be checked explicitly (same caveat as Resend in
    // src/lib/email.ts). Accepts either field name since this was built
    // without being able to reach mNotify's live docs from this sandbox —
    // double-check the first real send's logged response against
    // developer.mnotify.com and adjust if the shape differs.
    const ok = res.ok && (data?.code === "2000" || data?.status === "success");
    if (!ok) {
      const reason = data?.message || data?.code || data?.status || `HTTP ${res.status}`;
      console.error(`mNotify rejected SMS to ${to}:`, data);
      return { sent: false, error: String(reason) };
    }
    return { sent: true };
  } catch (e) {
    console.error(`Failed to send SMS to ${to}:`, e);
    return { sent: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
