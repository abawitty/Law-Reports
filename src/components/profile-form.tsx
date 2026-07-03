"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  program: string;
  level: string;
  hasGhanaCard: boolean;
};

export function ProfileForm({
  user,
  studentId,
}: {
  user: ProfileData;
  studentId: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      program: form.get("program"),
      level: form.get("level"),
      hasGhanaCard: form.get("hasGhanaCard") === "on",
    };

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Could not save changes");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="rounded-xl border border-black/10 p-5">
        {success && (
          <div className="mb-4 rounded-md border border-brand-green/30 bg-brand-green/5 p-3 text-sm text-brand-green-dark">
            Profile updated.
          </div>
        )}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">Student ID</dt>
            <dd className="font-medium text-gray-900">{studentId}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Full Name</dt>
            <dd className="font-medium text-gray-900">{user.fullName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{user.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Program</dt>
            <dd className="font-medium text-gray-900">{user.program || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Level</dt>
            <dd className="font-medium text-gray-900">{user.level || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Ghana Card</dt>
            <dd className="font-medium text-gray-900">
              {user.hasGhanaCard ? "Yes" : "Not yet — see Resources"}
            </dd>
          </div>
        </dl>
        <button
          onClick={() => setEditing(true)}
          className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit Details
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
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          name="fullName"
          defaultValue={user.fullName}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            defaultValue={user.phone}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select
            name="level"
            defaultValue={user.level}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="">Select</option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Program</label>
        <input
          name="program"
          defaultValue={user.program}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="hasGhanaCard"
          name="hasGhanaCard"
          type="checkbox"
          defaultChecked={user.hasGhanaCard}
          className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
        />
        <label htmlFor="hasGhanaCard" className="text-sm text-gray-700">
          I have a Ghana Card
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
