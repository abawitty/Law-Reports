"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "VICE_PRESIDENT", label: "Vice President" },
  { value: "SECRETARY", label: "General Secretary" },
  { value: "PRESIDENT", label: "President" },
];

export function CreateExecutiveForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState("VICE_PRESIDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ studentId: string; initialPassword: string } | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/executives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, studentId, role }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not create account");
      return;
    }

    setCreated({ studentId: data.studentId, initialPassword: data.initialPassword });
    setFullName("");
    setStudentId("");
    router.refresh();
  }

  if (created) {
    return (
      <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 p-5">
        <h3 className="font-semibold text-brand-green-dark">Account created</h3>
        <p className="mt-2 text-sm text-gray-700">
          Share these login details securely — the password is shown only this once. They&apos;ll
          be asked to set their own password the first time they log in.
        </p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-600">Member ID:</dt>
            <dd className="font-mono">{created.studentId}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-gray-600">Temporary Password:</dt>
            <dd className="font-mono">{created.initialPassword}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setCreated(null)}
          className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Create another account
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-black/10 p-5">
      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/5 p-3 text-sm text-brand-red">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Member ID (for login)</label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. VP-0001"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create Account"}
      </button>
    </form>
  );
}
