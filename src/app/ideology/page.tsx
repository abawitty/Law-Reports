import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Ideology",
  description:
    "NDC history, our governance philosophy, and links to our manifesto.",
};

export default function IdeologyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Ideology"
        title="What We Stand For"
        description="NDC history, our governance philosophy, and manifesto links."
      />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">NDC History</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>
            The National Democratic Congress (NDC) is one of Ghana&apos;s
            major political parties, founded on the principles of social
            democracy — equity, probity, accountability, and inclusive
            development. As the student wing of the NDC, TEIN carries these
            values onto campus, translating national ideals into practical
            support for students.
          </p>
          <p>
            TEIN-KUC continues this tradition locally, mobilising students
            around shared interests: affordable education, access to student
            loans, national identification, and a stronger student voice in
            institutional decisions.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-green-dark">
          Governance Philosophy
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {[
            {
              title: "Transparency",
              body: "Decisions affecting members — including elections — are conducted openly and recorded.",
            },
            {
              title: "Accountability",
              body: "Executives are answerable to members and to the queries and suggestions members submit.",
            },
            {
              title: "Inclusion",
              body: "Every registered member has an equal voice and an equal vote.",
            },
            {
              title: "Service",
              body: "Our first duty is connecting students with the information and support they need to succeed.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-black/10 p-5">
              <h3 className="font-semibold text-brand-green-dark">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-green-dark">
          Manifesto
        </h2>
        <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
          <p>
            The full TEIN-KUC &amp; NDC manifesto and policy documents will be
            linked here once published by the executive team. Members can
            request the latest manifesto via the{" "}
            <a href="/contact" className="font-semibold text-brand-green hover:underline">
              Contact
            </a>{" "}
            page.
          </p>
        </div>
      </section>
    </div>
  );
}
