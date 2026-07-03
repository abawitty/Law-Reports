"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Election = {
  id: string;
  title: string;
  status: string;
  startsAt: Date;
  endsAt: Date;
  positions: { id: string; title: string; candidates: { id: string }[] }[];
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  OPEN: "bg-brand-green/10 text-brand-green-dark",
  CLOSED: "bg-gray-200 text-gray-700",
};

export function ElectionAdminCard({ election }: { election: Election }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: string) {
    setLoading(true);
    await fetch(`/api/admin/elections/${election.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-black/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{election.title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[election.status] ?? ""}`}
        >
          {election.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {new Date(election.startsAt).toLocaleString()} –{" "}
        {new Date(election.endsAt).toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-gray-600">
        {election.positions.length} position(s) ·{" "}
        {election.positions.reduce((n, p) => n + p.candidates.length, 0)} candidate(s)
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/dashboard/admin/elections/${election.id}`}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Manage Positions &amp; Candidates
        </Link>
        {election.status === "DRAFT" && (
          <button
            disabled={loading}
            onClick={() => setStatus("OPEN")}
            className="rounded-md bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
          >
            Open Voting
          </button>
        )}
        {election.status === "OPEN" && (
          <button
            disabled={loading}
            onClick={() => setStatus("CLOSED")}
            className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:brightness-90 disabled:opacity-60"
          >
            Close Voting
          </button>
        )}
        {election.status === "CLOSED" && (
          <button
            disabled={loading}
            onClick={() => setStatus("OPEN")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Re-open
          </button>
        )}
      </div>
    </div>
  );
}
