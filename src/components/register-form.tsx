"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const studentId = formData.get("studentId") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        studentId,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/membership/login?registered=1");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
      <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
        Welcome to TEIN-KUC! Please complete all fields accurately — your information is
        kept confidential and used solely for membership purposes. For assistance, contact
        the President or General Secretary via the{" "}
        <Link href="/contact" className="font-semibold text-brand-green hover:underline">
          Contact
        </Link>{" "}
        page.
      </div>

      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/5 p-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            id="surname"
            name="surname"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
            Sex
          </label>
          <select
            id="sex"
            name="sex"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          Occupation
        </label>
        <input
          id="occupation"
          name="occupation"
          required
          placeholder="e.g. Student"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
            Faculty
          </label>
          <input
            id="faculty"
            name="faculty"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700">
            Programme
          </label>
          <input
            id="program"
            name="program"
            required
            placeholder="e.g. BSc Computer Science"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            id="level"
            name="level"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="100">Level 100</option>
            <option value="200">Level 200</option>
            <option value="300">Level 300</option>
            <option value="400">Level 400</option>
          </select>
        </div>
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
            Student ID Number
          </label>
          <input
            id="studentId"
            name="studentId"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div>
        <label htmlFor="constituency" className="block text-sm font-medium text-gray-700">
          Constituency of Residence
        </label>
        <input
          id="constituency"
          name="constituency"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">Do you have a Voters ID?</span>
        <div className="mt-1 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" name="hasVotersId" value="Yes" required className="text-brand-green focus:ring-brand-green" />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" name="hasVotersId" value="No" required className="text-brand-green focus:ring-brand-green" />
            No
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
            WhatsApp Number
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Upload a passport picture
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-green-dark"
        />
      </div>

      <div>
        <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
          Signature (Use initials)
        </label>
        <input
          id="signature"
          name="signature"
          required
          placeholder="e.g. A.B.A."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Choose a Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Used to log in to your member dashboard — this isn&apos;t part of the official
        membership form, but you&apos;ll need it to vote, view your data, and submit requests.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Register"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/membership/login" className="font-semibold text-brand-green hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
