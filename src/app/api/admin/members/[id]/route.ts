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
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Cascades to their photo, votes, and submitted requests — see
  // onDelete: Cascade on MemberPhoto/Vote/MemberRequest in schema.prisma.
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
