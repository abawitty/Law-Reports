import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { canManageExecutiveAccounts } from "@/lib/constants";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageExecutiveAccounts(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to delete accounts" },
      { status: 403 },
    );
  }

  const { id } = await params;
  if (id === check.session.user.id) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.deletedAt) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Soft delete: flag the account instead of removing it, so the President
  // can reinstate it later with everything (photo, votes, requests) intact.
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });

  return NextResponse.json({ ok: true });
}
