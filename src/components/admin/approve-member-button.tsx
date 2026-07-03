"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveMemberButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [override, setOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<string | null>(null);

  async function handleApprove() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipNumber: override || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not approve member");
      return;
    }

    setAssigned(data.membershipNumber);
    router.refresh();
  }

  if (assigned) {
    return <span className="font-mono text-xs text-brand-green-dark">{assigned}</span>;
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-md bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green-dark"
      >
        Approve
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {error && <span className="text-xs text-brand-red">{error}</span>}
      <div className="flex items-center gap-1">
        <input
          value={override}
          onChange={(e) => setOverride(e.target.value)}
          placeholder="Auto-assign"
          className="w-24 rounded-md border border-gray-300 px-1.5 py-1 text-xs focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading}
          className="rounded-md bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {loading ? "…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
