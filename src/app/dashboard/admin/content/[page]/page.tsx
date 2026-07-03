import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/page-hero";
import { getPageContent } from "@/lib/content";
import { PAGE_SLUGS, type PageSlug } from "@/lib/content-defaults";
import { HomeContentForm } from "@/components/admin/home-content-form";
import { AboutContentForm } from "@/components/admin/about-content-form";
import { IdeologyContentForm } from "@/components/admin/ideology-content-form";
import { ResourcesContentForm } from "@/components/admin/resources-content-form";
import { ContactContentForm } from "@/components/admin/contact-content-form";

const PAGE_LABELS: Record<PageSlug, string> = {
  home: "Home",
  about: "About Us",
  ideology: "Ideology",
  resources: "Resources",
  contact: "Contact",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const label = PAGE_LABELS[page as PageSlug] ?? "Page";
  return { title: `Edit ${label} Content` };
}

export default async function PageContentEditor({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  await requireAdmin();
  const { page } = await params;

  if (!PAGE_SLUGS.includes(page as PageSlug)) notFound();
  const slug = page as PageSlug;

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title={`Edit: ${PAGE_LABELS[slug]}`}
        description="Changes go live as soon as you save."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard/admin/content"
          className="text-sm font-medium text-brand-green hover:underline"
        >
          ← Back to Site Content
        </Link>

        <div className="mt-6">
          {slug === "home" && <HomeContentForm initial={await getPageContent("home")} />}
          {slug === "about" && <AboutContentForm initial={await getPageContent("about")} />}
          {slug === "ideology" && (
            <IdeologyContentForm initial={await getPageContent("ideology")} />
          )}
          {slug === "resources" && (
            <ResourcesContentForm initial={await getPageContent("resources")} />
          )}
          {slug === "contact" && <ContactContentForm initial={await getPageContent("contact")} />}
        </div>
      </section>
    </div>
  );
}
