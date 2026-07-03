import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";
import { getSiteImageMeta, siteImageUrl } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The history of TEIN-KUC, our executive team, and the President's profile.",
};

export default async function AboutPage() {
  const [content, presidentPhoto] = await Promise.all([
    getPageContent("about"),
    getSiteImageMeta("president-photo"),
  ]);
  const photoUrl = presidentPhoto.exists
    ? siteImageUrl("president-photo", presidentPhoto.version)
    : undefined;

  return (
    <div>
      <PageHero eyebrow="About Us" title={content.heroTitle} description={content.heroDescription} />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          History of TEIN-KUC
        </h2>
        <div className="mt-4 space-y-4 text-gray-700">
          {content.historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">
            The Executive Team
          </h2>
          <p className="mt-2 text-gray-600">
            The current executives elected to lead TEIN-KUC &amp; NDC.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.executives.map((exec, i) => (
              <div
                key={i}
                className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-lg font-bold text-brand-green-dark">
                  {exec.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{exec.name}</h3>
                <p className="text-sm text-brand-red">{exec.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">
          President&apos;s Profile
        </h2>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={content.presidentName}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-2xl font-bold text-brand-green-dark">
              {content.presidentName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {content.presidentName} — President
            </h3>
            <div className="mt-2 space-y-3 text-sm text-gray-600">
              {content.presidentBioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
