"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreatePageForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not create page");
      return;
    }

    router.push(`/dashboard/admin/content/pages/${data.page.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-xl border border-black/10 p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New page title, e.g. Scholarships"
        required
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create Page"}
      </button>
      {error && <p className="text-sm text-brand-red">{error}</p>}
    </form>
  );
}
