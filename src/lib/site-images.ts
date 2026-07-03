import { prisma } from "@/lib/prisma";

export const SITE_IMAGE_KEYS = ["tein-kuc-logo", "ndc-logo", "president-photo"] as const;
export type SiteImageKey = (typeof SITE_IMAGE_KEYS)[number];

export async function getSiteImageMeta(key: SiteImageKey) {
  const row = await prisma.siteImage.findUnique({
    where: { key },
    select: { updatedAt: true },
  });
  return row ? { exists: true as const, version: row.updatedAt.getTime() } : { exists: false as const };
}

export function siteImageUrl(key: SiteImageKey, version: number) {
  return `/api/site-image/${key}?v=${version}`;
}
