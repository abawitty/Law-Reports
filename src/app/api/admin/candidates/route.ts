import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const positionId = body?.positionId as string | undefined;
  const name = body?.name as string | undefined;
  const bio = body?.bio as string | undefined;

  if (!positionId || !name) {
    return NextResponse.json({ error: "Position and candidate name are required" }, { status: 400 });
  }

  const candidate = await prisma.candidate.create({
    data: { positionId, name, bio: bio || null },
  });

  return NextResponse.json({ ok: true, candidate }, { status: 201 });
}
