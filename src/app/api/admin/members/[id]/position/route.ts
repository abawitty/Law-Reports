import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { canManageExecutiveAccounts } from "@/lib/constants";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageExecutiveAccounts(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to set executive positions" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const position = typeof body?.position === "string" ? body.position.trim() : "";

  await prisma.user.update({
    where: { id },
    data: { position: position || null },
  });

  return NextResponse.json({ ok: true, position: position || null });
}
