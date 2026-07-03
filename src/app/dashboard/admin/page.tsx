import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { CreateElectionForm } from "@/components/create-election-form";
import { ElectionAdminCard } from "@/components/election-admin-card";
import { AdminRequestsPanel } from "@/components/admin-requests-panel";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminPage() {
  await requireAdmin();

  const [elections, requests, memberCount] = await Promise.all([
    prisma.election.findMany({
      include: { positions: { include: { candidates: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.memberRequest.findMany({
      include: { user: { select: { fullName: true, studentId: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Manage Elections &amp; Member Requests"
        description={`${memberCount} registered member(s).`}
      />

      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/members"
            className="inline-block rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:brightness-90"
          >
            View Registered Members →
          </Link>
          <Link
            href="/dashboard/admin/content"
            className="inline-block rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            Edit Site Content &amp; Images →
          </Link>
          <Link
            href="/dashboard/admin/gallery"
            className="inline-block rounded-md border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
          >
            Manage Photo Gallery →
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold text-brand-green-dark">Create Election</h2>
          <div className="mt-4 max-w-xl">
            <CreateElectionForm />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-brand-green-dark">All Elections</h2>
          <div className="mt-4 space-y-4">
            {elections.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
                No elections yet. Create one above.
              </div>
            ) : (
              elections.map((election) => (
                <ElectionAdminCard key={election.id} election={election} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-brand-green-dark">
            Member Queries, Requests &amp; Suggestions
          </h2>
          <div className="mt-4">
            <AdminRequestsPanel requests={requests} />
          </div>
        </div>
      </section>
    </div>
  );
}
