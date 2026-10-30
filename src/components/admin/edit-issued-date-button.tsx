"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function toMonthInput(iso: string | null): string {
  if (!iso) return new Date().toISOString().slice(0, 7);
  return new Date(iso).toISOString().slice(0, 7);
}

function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function EditIssuedDateButton({
  userId,
  initialIssuedAt,
}: {
  userId: string;
  initialIssuedAt: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [issuedAt, setIssuedAt] = useState(initialIssuedAt);
  const [month, setMonth] = useState(() => toMonthInput(initialIssuedAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/issued-date`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issuedAt: `${month}-01` }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save date");
      return;
    }
    setIssuedAt(`${month}-01`);
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        {error && <span className="text-[10px] text-brand-red">{error}</span>}
        <div className="flex items-center gap-1">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-md border border-gray-300 px-1 py-0.5 text-[10px] focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-brand-green px-2 py-1 text-[10px] font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
          >
            {saving ? "…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="rounded-md border border-gray-300 px-2 py-1 text-left text-xs font-medium text-gray-600 hover:bg-gray-100"
    >
      {formatMonthYear(issuedAt) ?? "Set date issued"}
    </button>
  );
}
