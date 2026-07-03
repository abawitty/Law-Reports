import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership",
  description: "Register for TEIN-KUC & NDC membership or log in to the member database.",
};

export default async function MembershipPage() {
  const content = await getPageContent("membership");

  return (
    <div>
      <PageHero eyebrow="Membership" title={content.heroTitle} description={content.heroDescription} />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-brand-green-dark">{content.newMemberTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{content.newMemberBody}</p>
            <Link
              href="/membership/register"
              className="mt-5 inline-block rounded-md bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
            >
              Register Now
            </Link>
          </div>

          <div className="rounded-2xl border border-black/10 p-7 shadow-sm">
            <h2 className="text-xl font-bold text-brand-green-dark">
              {content.existingMemberTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{content.existingMemberBody}</p>
            <Link
              href="/membership/login"
              className="mt-5 inline-block rounded-md border border-brand-green px-5 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
            >
              Member Login
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {content.features.map((f, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold text-brand-green-dark">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">Types of Membership</h2>
          <p className="mt-2 text-gray-600">{content.typesIntro}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {content.membershipTypes.map((type, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-5">
                <h3 className="font-semibold text-brand-green-dark">{type.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{type.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">The Constitution</h2>
        <p className="mt-2 max-w-2xl text-gray-600">{content.constitutionIntro}</p>
        <a
          href="/documents/teinkuc-constitution.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:brightness-90"
        >
          Download the TEIN-KUC Constitution (PDF)
        </a>
      </section>
    </div>
  );
}
