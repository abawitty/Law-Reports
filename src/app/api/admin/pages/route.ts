import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/api-auth";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
}

export async function POST(req: Request) {
  const check = await getAdminSession();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Enter a page title" }, { status: 400 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.customPage.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const maxOrder = await prisma.customPage.aggregate({ _max: { navOrder: true } });

  const page = await prisma.customPage.create({
    data: {
      title,
      slug,
      navLabel: title,
      navOrder: (maxOrder._max.navOrder ?? 0) + 1,
      published: false,
      blocks: [],
    },
  });

  return NextResponse.json({ ok: true, page });
}
