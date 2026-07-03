import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const electionId = body?.electionId as string | undefined;
  const title = body?.title as string | undefined;

  if (!electionId || !title) {
    return NextResponse.json({ error: "Election and title are required" }, { status: 400 });
  }

  const position = await prisma.position.create({
    data: { electionId, title },
  });

  return NextResponse.json({ ok: true, position }, { status: 201 });
}
