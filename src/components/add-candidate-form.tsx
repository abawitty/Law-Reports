"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddCandidateForm({ positionId }: { positionId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/admin/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positionId,
        name: data.get("name"),
        bio: data.get("bio"),
      }),
    });
    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.error ?? "Could not add candidate");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-end gap-2">
      {error && <p className="w-full text-xs text-brand-red">{error}</p>}
      <div className="min-w-[160px]">
        <label className="block text-xs font-medium text-gray-700">Candidate Name</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium text-gray-700">Short Bio (optional)</label>
        <input
          name="bio"
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md border border-brand-green px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green/5 disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add Candidate"}
      </button>
    </form>
  );
}
