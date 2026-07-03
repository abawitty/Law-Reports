import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ProfileForm } from "@/components/profile-form";
import { ElectionsPanel } from "@/components/elections-panel";
import { RequestForm } from "@/components/request-form";
import { RequestList } from "@/components/request-list";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default async function DashboardPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    return null;
  }

  const [elections, requests, myVotes] = await Promise.all([
    prisma.election.findMany({
      where: { status: { in: ["OPEN", "CLOSED"] } },
      include: {
        positions: {
          include: {
            candidates: { include: { _count: { select: { votes: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.memberRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vote.findMany({ where: { userId: user.id } }),
  ]);

  const votedPositionIds = new Set(myVotes.map((v) => v.positionId));

  return (
    <div>
      <PageHero
        eyebrow="Member Dashboard"
        title={`Welcome, ${user.fullName.split(" ")[0]}`}
        description="View your data, vote in open elections, and submit requests or suggestions."
      />

      {(user.role === "ADMIN" || user.role === "EXECUTIVE") && (
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <Link
            href="/dashboard/admin"
            className="inline-block rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:brightness-90"
          >
            Go to Admin Panel →
          </Link>
        </div>
      )}

      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6">
        <div>
          <h2 className="text-xl font-bold text-brand-green-dark">Your Details</h2>
          <div className="mt-4 max-w-xl">
            <ProfileForm
              user={{
                fullName: user.fullName,
                email: user.email,
                phone: user.phone ?? "",
                program: user.program ?? "",
                level: user.level ?? "",
                hasGhanaCard: user.hasGhanaCard,
              }}
              studentId={user.studentId}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-brand-green-dark">Elections</h2>
          <p className="mt-1 text-sm text-gray-600">
            Vote in open elections below. Results are visible once an election closes.
          </p>
          <div className="mt-4">
            <ElectionsPanel elections={elections} votedPositionIds={[...votedPositionIds]} />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">
              Submit a Query, Request, or Suggestion
            </h2>
            <div className="mt-4">
              <RequestForm />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-green-dark">Your Submissions</h2>
            <div className="mt-4">
              <RequestList requests={requests} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
