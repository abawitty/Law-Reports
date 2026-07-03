import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ProfileForm } from "@/components/profile-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { CompleteProfileForm } from "@/components/complete-profile-form";
import { ElectionsPanel } from "@/components/elections-panel";
import { RequestForm } from "@/components/request-form";
import { RequestList } from "@/components/request-list";
import { isProfileIncomplete } from "@/lib/profile";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default async function DashboardPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    return null;
  }

  if (user.mustChangePassword) {
    return (
      <div>
        <PageHero
          eyebrow="Member Dashboard"
          title="Set a New Password"
          description="Your account was created with a temporary password. Choose a new one to continue to your dashboard."
        />
        <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
          <ChangePasswordForm forced />
        </section>
      </div>
    );
  }

  if (isProfileIncomplete(user)) {
    return (
      <div>
        <PageHero
          eyebrow="Member Dashboard"
          title="Complete Your Profile"
          description="Some details from your membership record are missing. Please fill them in to continue to your dashboard."
        />
        <section className="mx-auto max-w-xl px-4 py-14 sm:px-6">
          <CompleteProfileForm
            initialSurname={user.surname ?? ""}
            initialFirstName={user.firstName ?? ""}
          />
        </section>
      </div>
    );
  }

  if (user.approvalStatus !== "APPROVED") {
    return (
      <div>
        <PageHero
          eyebrow="Member Dashboard"
          title="Membership Pending Approval"
          description="Your registration has been received. An executive will review and approve your membership, after which your official membership number will be assigned and your full dashboard unlocked."
        />
        <section className="mx-auto max-w-xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
            You&apos;re logged in as <strong>{user.fullName}</strong> ({user.studentId}). There&apos;s
            nothing further to do right now — check back once you&apos;ve been notified, or{" "}
            <a href="/contact" className="font-semibold text-brand-green hover:underline">
              contact the executives
            </a>{" "}
            if this is taking longer than expected.
          </div>
        </section>
      </div>
    );
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
        description={
          user.membershipNumber
            ? `Membership No. ${user.membershipNumber} — view your data, vote in open elections, and submit requests or suggestions.`
            : "View your data, vote in open elections, and submit requests or suggestions."
        }
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
          <h2 className="text-xl font-bold text-brand-green-dark">Change Password</h2>
          <div className="mt-4 max-w-xl">
            <ChangePasswordForm />
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
