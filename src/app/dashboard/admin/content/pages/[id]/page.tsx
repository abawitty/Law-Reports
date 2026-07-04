import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isBlockArray } from "@/lib/blocks";
import { PageBuilder } from "@/components/admin/page-builder";

export const metadata: Metadata = {
  title: "Edit Page",
};

export default async function EditCustomPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) notFound();

  const blocks = isBlockArray(page.blocks) ? page.blocks : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <Link
        href="/dashboard/admin/content/pages"
        className="text-sm font-medium text-brand-green hover:underline"
      >
        ← Back to Custom Pages
      </Link>

      <PageBuilder
        page={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          navLabel: page.navLabel,
          navOrder: page.navOrder,
          published: page.published,
          blocks,
        }}
      />
    </div>
  );
}
