import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Student Loan Trust Fund (SLTF) guides, Ghana Card information, and academic support for students.",
};

export default async function ResourcesPage() {
  const content = await getPageContent("resources");

  return (
    <div>
      <PageHero eyebrow="Resources" title={content.heroTitle} description={content.heroDescription} />

      <section id="sltf" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          Student Loan Trust Fund (SLTF)
        </h2>
        <p className="mt-3 text-gray-700">{content.sltfIntro}</p>

        <ol className="mt-6 space-y-4">
          {content.sltfSteps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-lg border border-black/10 bg-gray-50 p-4 text-sm text-gray-600">
          {content.sltfNote}
        </div>
      </section>

      <section
        id="ghana-card"
        className="scroll-mt-24 border-t border-black/10 bg-gray-50 py-14"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">Ghana Card</h2>
          <p className="mt-3 text-gray-700">{content.ghanaCardIntro}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {content.ghanaCardCards.map((card, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-5">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-black/10 bg-white p-4 text-sm text-gray-600">
            {content.ghanaCardNote}
          </div>
        </div>
      </section>

      <section id="academic" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          Academic Support
        </h2>
        <p className="mt-3 text-gray-700">{content.academicIntro}</p>
        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          {content.academicItems.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-brand-green">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
