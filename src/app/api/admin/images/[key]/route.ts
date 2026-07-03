import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { SITE_IMAGE_KEYS, type SiteImageKey } from "@/lib/site-images";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { key } = await params;
  if (!SITE_IMAGE_KEYS.includes(key as SiteImageKey)) {
    return NextResponse.json({ error: "Unknown image key" }, { status: 400 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type — use PNG, JPEG, WebP, or SVG" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 5MB)" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const row = await prisma.siteImage.upsert({
    where: { key },
    update: { data: bytes, mimeType: file.type },
    create: { key, data: bytes, mimeType: file.type },
  });

  return NextResponse.json({ ok: true, version: row.updatedAt.getTime() });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { key } = await params;
  await prisma.siteImage.deleteMany({ where: { key } });
  return NextResponse.json({ ok: true });
}
