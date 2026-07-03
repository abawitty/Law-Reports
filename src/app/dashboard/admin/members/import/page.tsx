import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/page-hero";
import { MemberImportForm } from "@/components/admin/member-import-form";

export const metadata: Metadata = {
  title: "Import Members",
};

export default async function ImportMembersPage() {
  await requireAdmin();

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Bulk Import Members"
        description="Create accounts for existing members from a CSV file. Each member gets a temporary password they must change on first login."
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard/admin/members"
          className="text-sm font-medium text-brand-green hover:underline"
        >
          ← Back to Registered Members
        </Link>

        <div className="mt-6">
          <MemberImportForm />
        </div>
      </section>
    </div>
  );
}
