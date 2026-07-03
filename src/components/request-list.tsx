type MemberRequest = {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  response: string | null;
  createdAt: Date;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-brand-green/10 text-brand-green-dark",
};

export function RequestList({ requests }: { requests: MemberRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
        You haven&apos;t submitted anything yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {requests.map((r) => (
        <li key={r.id} className="rounded-xl border border-black/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
              {r.type}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-700"}`}
            >
              {r.status.replace("_", " ")}
            </span>
          </div>
          <h4 className="mt-1 font-semibold text-gray-900">{r.subject}</h4>
          <p className="mt-1 text-sm text-gray-600">{r.message}</p>
          {r.response && (
            <div className="mt-3 rounded-md bg-brand-green/5 p-3 text-sm text-brand-green-dark">
              <span className="font-semibold">Response: </span>
              {r.response}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
