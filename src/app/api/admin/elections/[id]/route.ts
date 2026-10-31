import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { canManageElections, ELECTION_STATUSES } from "@/lib/constants";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageElections(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to manage elections" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status as string | undefined;

  if (!status || !ELECTION_STATUSES.includes(status as (typeof ELECTION_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const election = await prisma.election.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ ok: true, election });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!canManageElections(check.session.user.role)) {
    return NextResponse.json(
      { error: "You don't have permission to manage elections" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const election = await prisma.election.findUnique({ where: { id } });
  if (!election) {
    return NextResponse.json({ error: "Election not found" }, { status: 404 });
  }

  // Cascades to positions, candidates, and votes — see onDelete: Cascade
  // on Position/Vote in schema.prisma.
  await prisma.election.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
