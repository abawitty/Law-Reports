import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Direct links to TEIN-KUC & NDC leadership.",
};

export default async function ContactPage() {
  const content = await getPageContent("contact");

  return (
    <div>
      <PageHero eyebrow="Contact" title={content.heroTitle} description={content.heroDescription} />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">Leadership Contacts</h2>
            <div className="mt-5 space-y-4">
              {content.leadershipContacts.map((c, i) => (
                <div key={i} className="rounded-xl border border-black/10 p-4">
                  <h3 className="font-semibold text-gray-900">{c.role}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    <a href={`mailto:${c.email}`} className="text-brand-green hover:underline">
                      {c.email}
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">{c.phone}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">{content.leadershipNote}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">General Office</h2>
            <div className="mt-5 space-y-3 rounded-xl border border-black/10 p-5 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Address: </span>
                {content.officeAddress}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email: </span>
                <a href={`mailto:${content.officeEmail}`} className="text-brand-green hover:underline">
                  {content.officeEmail}
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">Office hours: </span>
                {content.officeHours}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-gray-50 p-5 text-sm text-gray-600">
              <p>{content.memberNote}</p>
              <a
                href="/membership/login"
                className="mt-2 inline-block font-semibold text-brand-green hover:underline"
              >
                Log in to your member dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
