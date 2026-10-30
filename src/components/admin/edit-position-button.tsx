"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditPositionButton({
  userId,
  initialPosition,
}: {
  userId: string;
  initialPosition: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [position, setPosition] = useState(initialPosition ?? "");
  const [saved, setSaved] = useState(initialPosition);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/position`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save position");
      return;
    }
    setSaved(data.position);
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        {error && <span className="text-[10px] text-brand-red">{error}</span>}
        <div className="flex items-center gap-1">
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. Organizer"
            className="w-28 rounded-md border border-gray-300 px-1.5 py-1 text-[10px] focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
      {saved || "Set position"}
    </button>
  );
}
