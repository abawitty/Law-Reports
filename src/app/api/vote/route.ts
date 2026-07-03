import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const positionId = body?.positionId as string | undefined;
  const candidateId = body?.candidateId as string | undefined;
  if (!positionId || !candidateId) {
    return NextResponse.json({ error: "Missing positionId or candidateId" }, { status: 400 });
  }

  const position = await prisma.position.findUnique({
    where: { id: positionId },
    include: { election: true, candidates: true },
  });
  if (!position) {
    return NextResponse.json({ error: "Position not found" }, { status: 404 });
  }
  if (position.election.status !== "OPEN") {
    return NextResponse.json({ error: "This election is not currently open" }, { status: 400 });
  }
  const now = new Date();
  if (now < position.election.startsAt || now > position.election.endsAt) {
    return NextResponse.json({ error: "This election is outside its voting window" }, { status: 400 });
  }
  if (!position.candidates.some((c) => c.id === candidateId)) {
    return NextResponse.json({ error: "Candidate does not belong to this position" }, { status: 400 });
  }

  const existingVote = await prisma.vote.findUnique({
    where: { userId_positionId: { userId: session.user.id, positionId } },
  });
  if (existingVote) {
    return NextResponse.json({ error: "You have already voted for this position" }, { status: 409 });
  }

  await prisma.vote.create({
    data: {
      userId: session.user.id,
      positionId,
      candidateId,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
