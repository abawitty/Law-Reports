import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const raw = Object.fromEntries(
    [
      "email",
      "surname",
      "firstName",
      "dateOfBirth",
      "sex",
      "occupation",
      "faculty",
      "program",
      "level",
      "studentId",
      "constituency",
      "hasVotersId",
      "phone",
      "whatsapp",
      "signature",
      "password",
      "confirmPassword",
    ].map((key) => [key, form.get(key)]),
  );

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const photo = form.get("photo");
  if (!photo || !(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "Upload a passport picture" }, { status: 400 });
  }
  if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
    return NextResponse.json(
      { error: "Passport picture must be a PNG, JPEG, or WebP image" },
      { status: 400 },
    );
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "Passport picture is too large (max 4MB)" }, { status: 400 });
  }

  const {
    email,
    surname,
    firstName,
    dateOfBirth,
    sex,
    occupation,
    faculty,
    program,
    level,
    studentId,
    constituency,
    hasVotersId,
    phone,
    whatsapp,
    signature,
    password,
  } = parsed.data;

  const parsedDob = new Date(dateOfBirth);
  if (Number.isNaN(parsedDob.getTime())) {
    return NextResponse.json({ error: "Enter a valid date of birth" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ studentId }, { email }] },
  });
  if (existing) {
    return NextResponse.json(
      {
        error:
          existing.studentId === studentId
            ? "An account with this Student ID already exists"
            : "An account with this email already exists",
      },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const photoBytes = Buffer.from(await photo.arrayBuffer());

  await prisma.user.create({
    data: {
      fullName: `${firstName} ${surname}`,
      surname,
      firstName,
      studentId,
      email,
      phone,
      whatsapp,
      program,
      level,
      faculty,
      occupation,
      constituency,
      sex,
      dateOfBirth: parsedDob,
      hasVotersId: hasVotersId === "Yes",
      signature,
      passwordHash,
      approvalStatus: "PENDING",
      photo: {
        create: {
          data: photoBytes,
          mimeType: photo.type,
        },
      },
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
