import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { BlockRenderer } from "@/components/block-renderer";
import { isBlockArray } from "@/lib/blocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.customPage.findUnique({ where: { slug } });
  return { title: page?.title ?? "Page" };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.customPage.findUnique({ where: { slug } });

  if (!page || !page.published || !isBlockArray(page.blocks)) {
    notFound();
  }

  return (
    <div>
      <PageHero title={page.title} />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <BlockRenderer blocks={page.blocks} />
      </section>
    </div>
  );
}
