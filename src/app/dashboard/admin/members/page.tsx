import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ResetPasswordButton } from "@/components/admin/reset-password-button";
import { ApproveMemberButton } from "@/components/admin/approve-member-button";
import { ResendApprovalEmailButton } from "@/components/admin/resend-approval-email-button";
import { EditIssuedDateButton } from "@/components/admin/edit-issued-date-button";
import { EditPositionButton } from "@/components/admin/edit-position-button";
import { DeleteMemberButton } from "@/components/admin/delete-member-button";
import {
  canGiveFinalApproval,
  canManageExecutiveAccounts,
  canManageMemberCredentials,
  canPartiallyApprove,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Members",
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED: "Approved",
  PARTIALLY_APPROVED: "Partially Approved",
  PENDING: "Pending",
};

const STATUS_CLASSES: Record<string, string> = {
  APPROVED: "bg-brand-green/10 text-brand-green-dark",
  PARTIALLY_APPROVED: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default async function MembersPage() {
  const viewer = await requireAdmin();
  const viewerCanFinalApprove = canGiveFinalApproval(viewer.role);
  const viewerCanPartialApprove = canPartiallyApprove(viewer.role);
  const viewerCanManageCredentials = canManageMemberCredentials(viewer.role);
  const viewerCanManageExecutives = canManageExecutiveAccounts(viewer.role);

  const members = await prisma.user.findMany({
    where: { role: "MEMBER", deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { photo: { select: { id: true } } },
  });

  return (
    <div>
      <PageHero
        eyebrow="Admin Panel"
        title="Registered Members"
        description={`${members.length} member(s) in the database.`}
      />

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard/admin" className="text-sm font-medium text-brand-green hover:underline">
            ← Back to Admin Panel
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin/members/import"
              className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:brightness-90"
            >
              Bulk Import (CSV)
            </Link>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- downloads a CSV file from an API route, not a page */}
            <a
              href="/api/admin/members/export"
              className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
            >
              Export as CSV
            </a>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-6 text-sm text-gray-600">
            No members have registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/10">
            <table className="min-w-full divide-y divide-black/10 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Photo",
                    "Name",
                    "Position",
                    "Membership No.",
                    "Status",
                    "Member ID",
                    "Email",
                    "Phone",
                    "WhatsApp",
                    "Programme",
                    "Level",
                    "Faculty",
                    "Occupation",
                    "Constituency",
                    "Voters ID",
                    "Sex",
                    "Role",
                    "Registered",
                    "Actions",
                  ].map((h) => (
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
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/member-photo/${m.id}`}
                          alt={m.fullName}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">
                      {m.fullName}
                      {m.mustChangePassword && (
                        <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800">
                          Temp password
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.position ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-600">
                      {m.membershipNumber ?? (
                        <ApproveMemberButton
                          userId={m.id}
                          approvalStatus={m.approvalStatus}
                          canFinalApprove={viewerCanFinalApprove}
                          canPartialApprove={viewerCanPartialApprove}
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_CLASSES[m.approvalStatus] ?? STATUS_CLASSES.PENDING
                        }`}
                      >
                        {STATUS_LABELS[m.approvalStatus] ?? "Pending"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.studentId}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.email ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.phone ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.whatsapp ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.program ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.level ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.faculty ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.occupation ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.constituency ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {m.hasVotersId === null ? "—" : m.hasVotersId ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.sex ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">{m.role}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="flex flex-col gap-1.5">
                        {viewerCanManageCredentials && (
                          <>
                            <ResetPasswordButton userId={m.id} />
                            {m.membershipNumber && m.email && (
                              <ResendApprovalEmailButton userId={m.id} />
                            )}
                          </>
                        )}
                        {m.membershipNumber && (
                          <a
                            href={`/api/member-id-card/${m.id}?download=1`}
                            download
                            className="rounded-md border border-gray-300 px-2 py-1 text-center text-xs font-medium text-gray-600 hover:bg-gray-100"
                          >
                            ID Card
                          </a>
                        )}
                        {m.membershipNumber && (
                          <EditIssuedDateButton
                            userId={m.id}
                            initialIssuedAt={m.membershipIssuedAt?.toISOString() ?? null}
                          />
                        )}
                        {viewerCanManageExecutives && (
                          <>
                            <EditPositionButton userId={m.id} initialPosition={m.position} />
                            <DeleteMemberButton userId={m.id} fullName={m.fullName} />
                          </>
                        )}
                      </div>
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
