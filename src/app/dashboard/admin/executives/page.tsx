import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { CreateExecutiveForm } from "@/components/admin/create-executive-form";
import { canManageExecutiveAccounts, ROLE_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Executive Accounts",
};

export default async function ExecutiveAccountsPage() {
  const viewer = await requireAdmin();
  if (!canManageExecutiveAccounts(viewer.role)) {
    redirect("/dashboard/admin");
  }

  const executives = await prisma.user.findMany({
    where: { role: { not: "MEMBER" } },
    orderBy: { createdAt: "asc" },
    select: { id: true, fullName: true, studentId: true, role: true, mustChangePassword: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Executive Accounts"
        description="Create and view the accounts with Admin Portal access."
      />

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
          ← Back to Admin Panel
        </Link>

        <CreateExecutiveForm />

        <div className="rounded-xl border border-black/10">
          <table className="min-w-full divide-y divide-black/10 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Member ID", "Role", "Status"].map((h) => (
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
              {executives.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">{e.fullName}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-600">{e.studentId}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                    {ROLE_LABELS[e.role as keyof typeof ROLE_LABELS] ?? e.role}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                    {e.mustChangePassword ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                        Temp password
                      </span>
                    ) : (
                      <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-xs font-semibold text-brand-green-dark">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
