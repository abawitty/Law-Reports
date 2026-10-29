"use client";

import { useState } from "react";

export function ResendApprovalEmailButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"sent" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setStatus(null);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/resend-email`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Could not resend email");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return <span className="text-[10px] text-brand-green-dark">Email sent</span>;
  }

  return (
    <span className="flex flex-col">
      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60"
      >
        {loading ? "…" : "Resend Email"}
      </button>
      {status === "error" && <span className="text-[10px] text-brand-red">{error}</span>}
    </span>
  );
}
