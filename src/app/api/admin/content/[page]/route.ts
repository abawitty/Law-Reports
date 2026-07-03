import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";
import { PAGE_SLUGS, type PageSlug } from "@/lib/content-defaults";
import { CONTENT_SCHEMAS } from "@/lib/content-schemas";

export async function PATCH(req: Request, { params }: { params: Promise<{ page: string }> }) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { page } = await params;
  if (!PAGE_SLUGS.includes(page as PageSlug)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const schema = CONTENT_SCHEMAS[page as PageSlug];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid content" },
      { status: 400 },
    );
  }

  await prisma.pageContent.upsert({
    where: { page },
    update: { data: parsed.data },
    create: { page, data: parsed.data },
  });

  return NextResponse.json({ ok: true });
}
