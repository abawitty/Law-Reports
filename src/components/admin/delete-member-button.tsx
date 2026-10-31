"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteMemberButton({ userId, fullName }: { userId: string; fullName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (
      !confirm(
        `Delete ${fullName}? They'll lose access immediately and move to the Deleted Members list, where the President can reinstate them later with everything intact.`,
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not delete account");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      {error && <span className="text-[10px] text-brand-red">{error}</span>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-md border border-brand-red px-2 py-1 text-xs font-medium text-brand-red hover:bg-brand-red/5 disabled:opacity-60"
      >
        {loading ? "…" : "Delete"}
      </button>
    </div>
  );
}
