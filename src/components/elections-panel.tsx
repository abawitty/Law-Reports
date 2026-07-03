"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Candidate = {
  id: string;
  name: string;
  bio: string | null;
  _count?: { votes: number };
};
type Position = { id: string; title: string; candidates: Candidate[] };
type Election = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startsAt: Date;
  endsAt: Date;
  positions: Position[];
};

export function ElectionsPanel({
  elections,
  votedPositionIds,
}: {
  elections: Election[];
  votedPositionIds: string[];
}) {
  if (elections.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
        There are no open or completed elections right now. Check back when
        the executives announce the next election.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {elections.map((election) => (
        <ElectionCard
          key={election.id}
          election={election}
          votedPositionIds={votedPositionIds}
        />
      ))}
    </div>
  );
}

function ElectionCard({
  election,
  votedPositionIds,
}: {
  election: Election;
  votedPositionIds: string[];
}) {
  const open = election.status === "OPEN";
  return (
    <div className="rounded-xl border border-black/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{election.title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            open ? "bg-brand-green/10 text-brand-green-dark" : "bg-gray-200 text-gray-700"
          }`}
        >
          {open ? "Open for voting" : "Closed — results below"}
        </span>
      </div>
      {election.description && (
        <p className="mt-1 text-sm text-gray-600">{election.description}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        {new Date(election.startsAt).toLocaleDateString()} –{" "}
        {new Date(election.endsAt).toLocaleDateString()}
      </p>

      <div className="mt-4 space-y-5">
        {election.positions.map((position) =>
          open ? (
            <VoteBlock
              key={position.id}
              position={position}
              alreadyVoted={votedPositionIds.includes(position.id)}
            />
          ) : (
            <ResultsBlock key={position.id} position={position} />
          ),
        )}
      </div>
    </div>
  );
}

function VoteBlock({
  position,
  alreadyVoted,
}: {
  position: Position;
  alreadyVoted: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState(alreadyVoted);

  async function castVote() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ positionId: position.id, candidateId: selected }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not cast vote");
      return;
    }
    setVoted(true);
    router.refresh();
  }

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{position.title}</h4>

      {voted ? (
        <p className="mt-2 text-sm text-brand-green-dark">
          ✓ Your vote for this position has been recorded.
        </p>
      ) : (
        <>
          {error && <p className="mt-2 text-sm text-brand-red">{error}</p>}
          <div className="mt-2 space-y-2">
            {position.candidates.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-2 rounded-md border border-gray-200 bg-white p-2.5 text-sm hover:border-brand-green"
              >
                <input
                  type="radio"
                  name={`position-${position.id}`}
                  value={c.id}
                  checked={selected === c.id}
                  onChange={() => setSelected(c.id)}
                  className="mt-0.5 h-4 w-4 text-brand-green focus:ring-brand-green"
                />
                <span>
                  <span className="block font-medium text-gray-900">{c.name}</span>
                  {c.bio && <span className="block text-xs text-gray-500">{c.bio}</span>}
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={castVote}
            disabled={!selected || loading}
            className="mt-3 rounded-md bg-brand-green px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Cast Vote"}
          </button>
        </>
      )}
    </div>
  );
}

function ResultsBlock({ position }: { position: Position }) {
  const totalVotes = position.candidates.reduce((sum, c) => sum + (c._count?.votes ?? 0), 0);
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{position.title}</h4>
      <ul className="mt-2 space-y-2">
        {position.candidates.map((c) => {
          const votes = c._count?.votes ?? 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          return (
            <li key={c.id} className="text-sm">
              <div className="flex justify-between text-gray-700">
                <span>{c.name}</span>
                <span className="font-medium">{votes} vote{votes === 1 ? "" : "s"} ({pct}%)</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-brand-green"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
