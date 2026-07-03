"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MemberRequest = {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  response: string | null;
  createdAt: Date;
  user: { fullName: string; studentId: string };
};

export function AdminRequestsPanel({ requests }: { requests: MemberRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
        No member submissions yet.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {requests.map((r) => (
        <RequestRow key={r.id} request={r} />
      ))}
    </ul>
  );
}

function RequestRow({ request }: { request: MemberRequest }) {
  const router = useRouter();
  const [status, setStatusValue] = useState(request.status);
  const [response, setResponse] = useState(request.response ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setLoading(true);
    setSaved(false);
    const res = await fetch(`/api/admin/requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, response }),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <li className="rounded-xl border border-black/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
          {request.type}
        </span>
        <span className="text-xs text-gray-500">
          {request.user.fullName} ({request.user.studentId})
        </span>
      </div>
      <h4 className="mt-1 font-semibold text-gray-900">{request.subject}</h4>
      <p className="mt-1 text-sm text-gray-600">{request.message}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
        <select
          value={status}
          onChange={(e) => setStatusValue(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <input
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write a response…"
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="rounded-md bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-xs text-brand-green-dark">Saved</span>}
      </div>
    </li>
  );
}
