import { prisma } from "@/lib/prisma";
import { PAGE_DEFAULTS, type PageSlug } from "@/lib/content-defaults";

export async function getPageContent<K extends PageSlug>(
  page: K,
): Promise<(typeof PAGE_DEFAULTS)[K]> {
  const row = await prisma.pageContent.findUnique({ where: { page } });
  const defaults = PAGE_DEFAULTS[page];
  if (!row) return defaults;
  return { ...defaults, ...(row.data as object) } as (typeof PAGE_DEFAULTS)[K];
}
