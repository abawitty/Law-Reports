import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/page-hero";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getSiteImageMeta, siteImageUrl } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Images & Logos",
};

export default async function ImagesContentPage() {
  await requireAdmin();

  const [teinKucLogo, ndcLogo, presidentPhoto, nationalLeaderPhoto] = await Promise.all([
    getSiteImageMeta("tein-kuc-logo"),
    getSiteImageMeta("ndc-logo"),
    getSiteImageMeta("president-photo"),
    getSiteImageMeta("national-leader-photo"),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Images & Logos"
        description="Upload PNG, JPEG, WebP, or SVG files up to 4MB."
      />

      <section className="mx-auto max-w-2xl space-y-5 px-4 py-10 sm:px-6">
        <Link
          href="/dashboard/admin/content"
          className="text-sm font-medium text-brand-green hover:underline"
        >
          ← Back to Site Content
        </Link>

        <ImageUploadField
          imageKey="tein-kuc-logo"
          label="TEIN-KUC Logo"
          currentUrl={
            teinKucLogo.exists ? siteImageUrl("tein-kuc-logo", teinKucLogo.version) : undefined
          }
        />
        <ImageUploadField
          imageKey="ndc-logo"
          label="NDC Logo"
          currentUrl={ndcLogo.exists ? siteImageUrl("ndc-logo", ndcLogo.version) : undefined}
        />
        <ImageUploadField
          imageKey="president-photo"
          label="President's Photo"
          currentUrl={
            presidentPhoto.exists
              ? siteImageUrl("president-photo", presidentPhoto.version)
              : undefined
          }
        />
        <ImageUploadField
          imageKey="national-leader-photo"
          label="National Leadership Photo (shown on the Ideology page)"
          currentUrl={
            nationalLeaderPhoto.exists
              ? siteImageUrl("national-leader-photo", nationalLeaderPhoto.version)
              : undefined
          }
        />
      </section>
    </div>
  );
}
