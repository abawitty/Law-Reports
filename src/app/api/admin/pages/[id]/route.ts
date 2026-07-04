import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { isBlockArray } from "@/lib/blocks";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data: Prisma.CustomPageUpdateInput = {};

  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.navLabel === "string" && body.navLabel.trim()) data.navLabel = body.navLabel.trim();
  if (typeof body.navOrder === "number") data.navOrder = body.navOrder;
  if (typeof body.published === "boolean") data.published = body.published;
  if (isBlockArray(body.blocks)) data.blocks = body.blocks as Prisma.InputJsonValue;

  const page = await prisma.customPage.update({ where: { id }, data });
  return NextResponse.json({ ok: true, page });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  await prisma.customPage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
