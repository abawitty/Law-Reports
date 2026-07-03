import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { GalleryUploadForm } from "@/components/admin/gallery-upload-form";
import { GalleryDeleteButton } from "@/components/admin/gallery-delete-button";

export const metadata: Metadata = {
  title: "Photo Gallery",
};

export default async function AdminGalleryPage() {
  await requireAdmin();

  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, caption: true, createdAt: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Photo Gallery"
        description="Upload activity photos to slide on the homepage and appear on the Media page."
      />

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Admin Panel
        </Link>

        <GalleryUploadForm />

        {photos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
            No photos uploaded yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {photos.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/gallery-photo/${p.id}`}
                  alt={p.caption ?? "Gallery photo"}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-700">{p.caption || "—"}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <GalleryDeleteButton id={p.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
