import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { canManageExecutiveAccounts } from "@/lib/constants";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageExecutiveAccounts(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to reinstate accounts" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.deletedAt) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  await prisma.user.update({ where: { id }, data: { deletedAt: null } });

  return NextResponse.json({ ok: true });
}
