import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { AddPositionForm } from "@/components/add-position-form";
import { AddCandidateForm } from "@/components/add-candidate-form";

export const metadata: Metadata = {
  title: "Manage Election",
};

export default async function ManageElectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const election = await prisma.election.findUnique({
    where: { id },
    include: {
      positions: {
        include: { candidates: { include: { _count: { select: { votes: true } } } } },
      },
    },
  });

  if (!election) notFound();

  return (
    <div>
      <PageHero eyebrow="Admin Panel" title={election.title} description={election.description ?? undefined} />

      <section className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Admin Panel
        </Link>

        <div>
          <h2 className="text-lg font-bold text-brand-green-dark">Add a Position</h2>
          <div className="mt-3">
            <AddPositionForm electionId={election.id} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-brand-green-dark">Positions &amp; Candidates</h2>
          {election.positions.length === 0 && (
            <p className="text-sm text-gray-600">No positions yet. Add one above.</p>
          )}
          {election.positions.map((position) => (
            <div key={position.id} className="rounded-xl border border-black/10 p-5">
              <h3 className="font-semibold text-gray-900">{position.title}</h3>
              <ul className="mt-3 space-y-2">
                {position.candidates.map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                      {c.bio && <span className="ml-2 text-xs text-gray-500">{c.bio}</span>}
                    </div>
                    <span className="text-xs text-gray-500">{c._count.votes} vote(s)</span>
                  </li>
                ))}
                {position.candidates.length === 0 && (
                  <li className="text-sm text-gray-500">No candidates yet.</li>
                )}
              </ul>
              <AddCandidateForm positionId={position.id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
