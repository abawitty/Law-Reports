"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [emailed, setEmailed] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  async function handleReset() {
    if (!confirm("Reset this member's password? They will need to set a new one on next login.")) {
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/members/${userId}/reset-password`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setNewPassword(data.newPassword);
      setEmailed(Boolean(data.emailed));
      setEmailError(data.emailError ?? null);
      setSmsSent(Boolean(data.smsSent));
      setSmsError(data.smsError ?? null);
      router.refresh();
    }
  }

  if (newPassword) {
    return (
      <span className="flex flex-col">
        <span
          className="font-mono text-xs text-brand-green-dark"
          title="Share this with the member — it won't be shown again"
        >
          {newPassword}
        </span>
        <span className="text-[10px] text-gray-500">
          {emailed ? "Emailed to member" : emailError ? `Not emailed: ${emailError}` : "Not emailed — no email on file"}
        </span>
        <span className="text-[10px] text-gray-500">
          {smsSent ? "Texted to member" : smsError ? `Not texted: ${smsError}` : "Not texted — no phone on file"}
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={loading}
      className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60"
    >
      {loading ? "…" : "Reset Password"}
    </button>
  );
}
