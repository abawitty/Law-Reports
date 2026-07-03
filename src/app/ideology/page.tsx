import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ideology",
  description:
    "NDC history, our governance philosophy, and links to our manifesto.",
};

export default async function IdeologyPage() {
  const content = await getPageContent("ideology");

  return (
    <div>
      <PageHero eyebrow="Ideology" title={content.heroTitle} description={content.heroDescription} />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">NDC History</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          {content.historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-green-dark">
          Governance Philosophy
        </h2>
        <p className="mt-4 text-gray-700">{content.philosophyIntro}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {content.philosophyCards.map((item, i) => (
            <div key={i} className="rounded-xl border border-black/10 p-5">
              <h3 className="font-semibold text-brand-green-dark">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-brand-green-dark">
          Manifesto
        </h2>
        <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
          <p>{content.manifestoText}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href="https://ndc.org.gh/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-green hover:underline"
            >
              Visit ndc.org.gh →
            </a>
            <a href="/contact" className="font-semibold text-brand-green hover:underline">
              Contact TEIN-KUC &amp; NDC →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
