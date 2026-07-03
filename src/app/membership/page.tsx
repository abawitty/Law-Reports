import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Membership",
  description: "Register for TEIN-KUC & NDC membership or log in to the member database.",
};

export default function MembershipPage() {
  return (
    <div>
      <PageHero
        eyebrow="Membership"
        title="Join &amp; Access the Member Portal"
        description="Register your details once, then log in anytime to vote in elections, view your data, and reach the executives directly."
      />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-brand-green-dark">New Member</h2>
            <p className="mt-2 text-sm text-gray-600">
              Register with your student details to create your account in
              the member database.
            </p>
            <Link
              href="/membership/register"
              className="mt-5 inline-block rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
            >
              Register Now
            </Link>
          </div>

          <div className="rounded-2xl border border-black/10 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-brand-green-dark">Existing Member</h2>
            <p className="mt-2 text-sm text-gray-600">
              Log in to the member database to view your profile, vote, and
              submit requests.
            </p>
            <Link
              href="/membership/login"
              className="mt-5 inline-block rounded-md border border-brand-green px-5 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
            >
              Member Login
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { title: "Your Data", body: "View and keep your membership details up to date." },
            { title: "Online Elections", body: "Vote securely in scheduled elections for TEIN-KUC executives." },
            { title: "Requests & Suggestions", body: "Submit queries or suggestions and track responses from leadership." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold text-brand-green-dark">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
