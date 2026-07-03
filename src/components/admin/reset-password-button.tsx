"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);

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
      router.refresh();
    }
  }

  if (newPassword) {
    return (
      <span className="font-mono text-xs text-brand-green-dark" title="Share this with the member — it won't be shown again">
        {newPassword}
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
