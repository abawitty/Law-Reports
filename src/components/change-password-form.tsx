"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChangePasswordForm({ forced = false }: { forced?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      currentPassword: data.get("currentPassword"),
      newPassword: data.get("newPassword"),
      confirmNewPassword: data.get("confirmNewPassword"),
    };

    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(result.error ?? "Could not change password");
      return;
    }

    setSuccess(true);
    form.reset();
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 rounded-xl border p-5 ${
        forced ? "border-brand-red/30 bg-brand-red/5" : "border-black/10"
      }`}
    >
      {forced && (
        <p className="text-sm text-brand-red">
          You&apos;re using a temporary password. Please set a new password to continue.
        </p>
      )}
      {success && (
        <div className="rounded-md border border-brand-green/30 bg-brand-green/5 p-3 text-sm text-brand-green-dark">
          Password changed.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/5 p-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {forced ? "Temporary Password" : "Current Password"}
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            name="newPassword"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            name="confirmNewPassword"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}
