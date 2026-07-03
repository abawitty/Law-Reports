"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      type: data.get("type"),
      subject: data.get("subject"),
      message: data.get("message"),
    };

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.error ?? "Could not submit. Please try again.");
      return;
    }

    setSuccess(true);
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-black/10 p-5">
      {success && (
        <div className="rounded-md border border-brand-green/30 bg-brand-green/5 p-3 text-sm text-brand-green-dark">
          Submitted. An executive will follow up.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/5 p-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          defaultValue="QUERY"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="QUERY">Query</option>
          <option value="SUGGESTION">Suggestion</option>
          <option value="REQUEST">Request</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          name="subject"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          minLength={10}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
