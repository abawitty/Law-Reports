"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddPositionForm({ electionId }: { electionId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const title = new FormData(form).get("title");

    const res = await fetch("/api/admin/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ electionId, title }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not add position");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      {error && <p className="w-full text-sm text-brand-red">{error}</p>}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-700">New Position Title</label>
        <input
          name="title"
          required
          placeholder="e.g. President"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add Position"}
      </button>
    </form>
  );
}
