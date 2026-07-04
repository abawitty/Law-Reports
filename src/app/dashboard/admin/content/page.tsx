import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/page-hero";
import { PAGE_SLUGS } from "@/lib/content-defaults";

export const metadata: Metadata = {
  title: "Site Content",
};

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  about: "About Us",
  membership: "Membership",
  ideology: "Ideology",
  resources: "Resources",
  contact: "Contact",
};

export default async function ContentIndexPage() {
  await requireAdmin();

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Site Content"
        description="Edit the text on every public page, and upload logos and photos — no code required."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Admin Panel
        </Link>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PAGE_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/dashboard/admin/content/${slug}`}
              className="rounded-xl border border-black/10 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold text-brand-green-dark">{PAGE_LABELS[slug]} page</h3>
              <p className="mt-1 text-sm text-gray-600">Edit the text on this page.</p>
            </Link>
          ))}

          <Link
            href="/dashboard/admin/content/images"
            className="rounded-xl border border-black/10 bg-brand-green/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-brand-green-dark">Images &amp; Logos</h3>
            <p className="mt-1 text-sm text-gray-600">
              Upload the TEIN-KUC logo, NDC logo, and President&apos;s photo.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/content/pages"
            className="rounded-xl border border-black/10 bg-brand-green/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-semibold text-brand-green-dark">Custom Pages</h3>
            <p className="mt-1 text-sm text-gray-600">
              Build brand new pages freehand — headings, text, images, and buttons, arranged
              however you like.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
