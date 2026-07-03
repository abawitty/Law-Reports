import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Media",
  description: "Photos from TEIN-KUC & NDC activities and events.",
};

export default async function MediaPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, caption: true, createdAt: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Media"
        title="Photo Gallery"
        description="A look at TEIN-KUC & NDC activities, events, and milestones."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
            No photos have been added yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="overflow-hidden rounded-xl border border-black/10 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/gallery-photo/${photo.id}`}
                  alt={photo.caption ?? "TEIN-KUC activity photo"}
                  className="h-56 w-full object-cover"
                />
                {photo.caption && (
                  <figcaption className="p-3 text-sm text-gray-600">{photo.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
