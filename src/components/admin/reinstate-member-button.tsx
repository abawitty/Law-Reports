"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReinstateMemberButton({ userId, fullName }: { userId: string; fullName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReinstate() {
    if (!confirm(`Reinstate ${fullName}? They'll regain access with all their data intact.`)) {
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/reinstate`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not reinstate account");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      {error && <span className="text-[10px] text-brand-red">{error}</span>}
      <button
        type="button"
        onClick={handleReinstate}
        disabled={loading}
        className="rounded-md border border-brand-green px-2 py-1 text-xs font-medium text-brand-green hover:bg-brand-green/5 disabled:opacity-60"
      >
        {loading ? "…" : "Reinstate"}
      </button>
    </div>
  );
}
