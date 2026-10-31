import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ReinstateMemberButton } from "@/components/admin/reinstate-member-button";
import { canManageExecutiveAccounts, ROLE_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Deleted Members",
};

export default async function DeletedMembersPage() {
  const viewer = await requireAdmin();
  if (!canManageExecutiveAccounts(viewer.role)) {
    redirect("/dashboard/admin");
  }

  const deleted = await prisma.user.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: "desc" },
    select: {
      id: true,
      fullName: true,
      studentId: true,
      role: true,
      membershipNumber: true,
      deletedAt: true,
    },
  });

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Deleted Members"
        description="Accounts removed by the President. Reinstate to restore full access and all their data."
      />

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Admin Panel
        </Link>

        {deleted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
            No deleted accounts.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/10">
            <table className="min-w-full divide-y divide-black/10 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Member ID", "Role", "Membership No.", "Deleted", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 bg-white">
                {deleted.map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">
                      {m.fullName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-600">
                      {m.studentId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {ROLE_LABELS[m.role as keyof typeof ROLE_LABELS] ?? m.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-600">
                      {m.membershipNumber ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.deletedAt ? new Date(m.deletedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <ReinstateMemberButton userId={m.id} fullName={m.fullName} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
