import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IdCard } from "@/lib/id-card";
import { hasAdminPortalAccess } from "@/lib/constants";

function toDataUri(data: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const isSelf = session.user.id === userId;
  const isAdmin = hasAdminPortalAccess(session.user.role);
  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [user, photo, logo] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.memberPhoto.findUnique({ where: { userId } }),
    prisma.siteImage.findUnique({ where: { key: "tein-kuc-logo" } }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  if (!user.membershipNumber) {
    return NextResponse.json(
      { error: "This member doesn't have a membership number yet" },
      { status: 400 },
    );
  }

  const dateIssued = user.membershipIssuedAt
    ? new Date(user.membershipIssuedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const image = new ImageResponse(
    IdCard({
      fullName: user.fullName,
      membershipNumber: user.membershipNumber,
      faculty: user.faculty ?? "",
      constituency: user.constituency ?? "",
      dateIssued,
      photoDataUri: photo ? toDataUri(Buffer.from(photo.data), photo.mimeType) : null,
      logoDataUri: logo ? toDataUri(Buffer.from(logo.data), logo.mimeType) : null,
    }),
    { width: 1050, height: 660 },
  );

  const download = new URL(req.url).searchParams.get("download");
  const headers = new Headers(image.headers);
  headers.set("Cache-Control", "private, no-store");
  if (download) {
    const filename = `TEIN-KUC-ID-${user.membershipNumber}.png`;
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  }

  return new NextResponse(image.body, { status: 200, headers });
}
