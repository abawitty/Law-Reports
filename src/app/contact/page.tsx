import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Direct links to TEIN-KUC & NDC leadership.",
};

const LEADERSHIP_CONTACTS = [
  { role: "President", email: "president@teinkuc.org", phone: "+233 20 000 0001" },
  { role: "Vice President", email: "vp@teinkuc.org", phone: "+233 20 000 0002" },
  { role: "General Secretary", email: "secretary@teinkuc.org", phone: "+233 20 000 0003" },
  { role: "Organiser", email: "organiser@teinkuc.org", phone: "+233 20 000 0004" },
];

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach TEIN-KUC & NDC leadership directly, or send a general message below."
      />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">Leadership Contacts</h2>
            <div className="mt-5 space-y-4">
              {LEADERSHIP_CONTACTS.map((c) => (
                <div key={c.role} className="rounded-xl border border-black/10 p-4">
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
            <p className="mt-4 text-xs text-gray-500">
              Contact details shown are placeholders and will be updated by
              the executive office.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">General Office</h2>
            <div className="mt-5 space-y-3 rounded-xl border border-black/10 p-5 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Address: </span>
                Kings University College, Ghana
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email: </span>
                <a href="mailto:info@teinkuc.org" className="text-brand-green hover:underline">
                  info@teinkuc.org
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">Office hours: </span>
                Monday – Friday, 9:00am – 4:00pm
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-gray-50 p-5 text-sm text-gray-600">
              For member-specific requests, queries, or suggestions, please{" "}
              <a href="/membership/login" className="font-semibold text-brand-green hover:underline">
                log in to your member dashboard
              </a>{" "}
              so the right executive can follow up with you directly.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
