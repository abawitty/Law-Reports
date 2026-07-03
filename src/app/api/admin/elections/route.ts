import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const title = body?.title as string | undefined;
  const description = body?.description as string | undefined;
  const startsAt = body?.startsAt as string | undefined;
  const endsAt = body?.endsAt as string | undefined;

  if (!title || !startsAt || !endsAt) {
    return NextResponse.json({ error: "Title, start date, and end date are required" }, { status: 400 });
  }

  const election = await prisma.election.create({
    data: {
      title,
      description: description || null,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      status: "DRAFT",
    },
  });

  return NextResponse.json({ ok: true, election }, { status: 201 });
}
