"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function ApproveMemberButton({
  userId,
  approvalStatus,
  canFinalApprove,
  canPartialApprove,
}: {
  userId: string;
  approvalStatus: string;
  canFinalApprove: boolean;
  canPartialApprove: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [override, setOverride] = useState("");
  const [issuedMonth, setIssuedMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [partiallyApproved, setPartiallyApproved] = useState(approvalStatus === "PARTIALLY_APPROVED");

  async function postApproval(body: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/members/${userId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not approve member");
      return;
    }

    if (data.partial) {
      setPartiallyApproved(true);
    } else {
      setAssigned(data.membershipNumber);
    }
    router.refresh();
  }

  if (assigned) {
    return <span className="font-mono text-xs text-brand-green-dark">{assigned}</span>;
  }

  if (partiallyApproved && !canFinalApprove) {
    return (
      <span className="text-[10px] font-medium text-yellow-700">
        Partially approved — awaiting the President
      </span>
    );
  }

  if (!canFinalApprove && !canPartialApprove) {
    return <span className="text-xs text-gray-400">Pending</span>;
  }

  // Vice President's partial-approve path: a single click, no membership
  // number or issue date to set — that happens at final approval.
  if (!canFinalApprove) {
    return (
      <div className="flex flex-col gap-1">
        {error && <span className="text-xs text-brand-red">{error}</span>}
        <button
          type="button"
          onClick={() => postApproval({})}
          disabled={loading}
          className="rounded-md bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {loading ? "…" : "Approve"}
        </button>
      </div>
    );
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-md bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green-dark"
      >
        {partiallyApproved ? "Final Approve" : "Approve"}
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
          onClick={() =>
            postApproval({
              membershipNumber: override || undefined,
              issuedAt: issuedMonth ? `${issuedMonth}-01` : undefined,
            })
          }
          disabled={loading}
          className="rounded-md bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {loading ? "…" : "Confirm"}
        </button>
      </div>
      <label className="flex items-center gap-1 text-[10px] text-gray-500">
        Date issued
        <input
          type="month"
          value={issuedMonth}
          onChange={(e) => setIssuedMonth(e.target.value)}
          className="rounded-md border border-gray-300 px-1 py-0.5 text-[10px] focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </label>
    </div>
  );
}
