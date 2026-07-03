import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completeProfileSchema } from "@/lib/validation";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const raw = Object.fromEntries(
    [
      "surname",
      "firstName",
      "dateOfBirth",
      "sex",
      "occupation",
      "faculty",
      "program",
      "level",
      "constituency",
      "hasVotersId",
      "phone",
      "whatsapp",
      "signature",
    ].map((key) => [key, form.get(key)]),
  );

  const parsed = completeProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const dateOfBirth = new Date(parsed.data.dateOfBirth);
  if (Number.isNaN(dateOfBirth.getTime())) {
    return NextResponse.json({ error: "Enter a valid date of birth" }, { status: 400 });
  }

  const photo = form.get("photo");
  if (photo && photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
      return NextResponse.json(
        { error: "Passport picture must be a PNG, JPEG, or WebP image" },
        { status: 400 },
      );
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Passport picture is too large (max 4MB)" },
        { status: 400 },
      );
    }
  }

  const { surname, firstName, sex, occupation, faculty, program, level, constituency, hasVotersId, phone, whatsapp, signature } =
    parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: `${firstName} ${surname}`,
      surname,
      firstName,
      dateOfBirth,
      sex,
      occupation,
      faculty,
      program,
      level,
      constituency,
      hasVotersId: hasVotersId === "Yes",
      phone,
      whatsapp,
      signature,
    },
  });

  if (photo && photo instanceof File && photo.size > 0) {
    const photoBytes = Buffer.from(await photo.arrayBuffer());
    await prisma.memberPhoto.upsert({
      where: { userId: session.user.id },
      update: { data: photoBytes, mimeType: photo.type },
      create: { userId: session.user.id, data: photoBytes, mimeType: photo.type },
    });
  }

  return NextResponse.json({ ok: true });
}
