import Link from "next/link";
import { getPageContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { GallerySlider } from "@/components/gallery-slider";

export default async function Home() {
  const [content, photos] = await Promise.all([
    getPageContent("home"),
    prisma.galleryPhoto.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, caption: true },
    }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white">
              {content.heroEyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">{content.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/membership/register"
                className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-green-dark shadow-sm hover:bg-white/90"
              >
                Become a Member
              </Link>
              <Link
                href="/resources"
                className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Resources
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">{content.heroPanelTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              {content.heroPanelItems.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-green-dark">{content.sectionHeading}</h2>
        <p className="mt-2 max-w-2xl text-gray-600">{content.sectionDescription}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.highlights.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-black/10 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold text-brand-green-dark">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {photos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-brand-green-dark">Recent Activities</h2>
            <Link href="/media" className="text-sm font-semibold text-brand-green hover:underline">
              View all photos →
            </Link>
          </div>
          <div className="mt-6">
            <GallerySlider photos={photos} />
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">
                {content.purposeTitle}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{content.purposeBody}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">
                {content.voiceTitle}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{content.voiceBody}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-green-dark">
                {content.involvedTitle}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{content.involvedBody}</p>
              <Link
                href="/membership/register"
                className="mt-3 inline-block text-sm font-semibold text-brand-green hover:underline"
              >
                Register now →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
