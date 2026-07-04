import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/prisma";
import { CreatePageForm } from "@/components/admin/create-page-form";

export const metadata: Metadata = {
  title: "Custom Pages",
};

export default async function CustomPagesIndex() {
  await requireAdmin();

  const pages = await prisma.customPage.findMany({ orderBy: { navOrder: "asc" } });

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Custom Pages"
        description="Build brand new pages from scratch — headings, text, images, and buttons, arranged however you like. They appear in the site menu once published."
      />

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin/content" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Site Content
        </Link>

        <CreatePageForm />

        <div className="space-y-3">
          {pages.length === 0 && (
            <p className="text-sm text-gray-500">No custom pages yet — create one above.</p>
          )}
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/dashboard/admin/content/pages/${page.id}`}
              className="flex items-center justify-between rounded-xl border border-black/10 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-brand-green-dark">{page.title}</h3>
                <p className="text-xs text-gray-500">/p/{page.slug}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  page.published
                    ? "bg-brand-green/10 text-brand-green-dark"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {page.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
