import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const isSelf = session.user.id === userId;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "EXECUTIVE";
  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const photo = await prisma.memberPhoto.findUnique({ where: { userId } });
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(photo.data), {
    status: 200,
    headers: {
      "Content-Type": photo.mimeType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
