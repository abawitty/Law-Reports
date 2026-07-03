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
            The National Democratic Congress (NDC) was founded on 28 July
            1992 by former Head of State Jerry John Rawlings, as Ghana
            transitioned from military rule under the Provisional National
            Defence Council (PNDC) to multi-party democracy. The party traces
            its roots to the 4 June 1979 Uprising and the 31 December 1981
            Revolution, events that set the tone for transparency,
            accountability, probity, and social justice in Ghanaian
            governance.
          </p>
          <p>
            The NDC went on to win the 1992 and 1996 elections under
            Rawlings, and has since alternated in and out of government as
            one of Ghana&apos;s two dominant political parties. As the
            student wing of the NDC, TEIN carries the party&apos;s founding
            values onto campus, translating them into practical support for
            students.
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
        <p className="mt-4 text-gray-700">
          As a social democratic party, the NDC believes in the gradual
          development of society on the basis of freedom, equality, and
          solidarity — participatory democracy, responsible governance, and
          social welfare policies that address inequality and promote
          equitable development. Internationally, the NDC is a member of the
          Progressive Alliance and the Socialist International. Its colours
          are red, white, green, and black, and its motto is{" "}
          <span className="font-semibold text-brand-green-dark">
            &ldquo;Unity, Stability, and Development&rdquo;
          </span>{" "}
          — the same principle TEIN-KUC applies to student governance on
          campus.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
            The NDC&apos;s national manifesto and policy documents are
            published on the party&apos;s official website,{" "}
            <a
              href="https://ndc.org.gh/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-green hover:underline"
            >
              ndc.org.gh
            </a>
            . TEIN-KUC &amp; NDC&apos;s own chapter manifesto and policy
            priorities will be linked here once published by the executive
            team. Members can request the latest documents via the{" "}
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
