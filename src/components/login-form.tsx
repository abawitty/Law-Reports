"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      studentId: form.get("studentId"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid Member ID or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {justRegistered && (
        <div className="rounded-md border border-brand-green/30 bg-brand-green/5 p-3 text-sm text-brand-green-dark">
          Account created. Please log in.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/5 p-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
          Member ID
        </label>
        <input
          id="studentId"
          name="studentId"
          required
          autoFocus
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Student ID or Membership Number, whichever you registered with.
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>

      <p className="text-center text-sm text-gray-600">
        New here?{" "}
        <Link href="/membership/register" className="font-semibold text-brand-green hover:underline">
          Create a member account
        </Link>
      </p>
    </form>
  );
}
