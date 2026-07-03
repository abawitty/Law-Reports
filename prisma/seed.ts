import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminStudentId = process.env.SEED_ADMIN_STUDENT_ID ?? "ADMIN-0001";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const admin = await prisma.user.upsert({
    where: { studentId: adminStudentId },
    update: {},
    create: {
      fullName: "TEIN-KUC Administrator",
      studentId: adminStudentId,
      email: "admin@teinkuc.org",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const election = await prisma.election.upsert({
    where: { id: "sample-election" },
    update: {},
    create: {
      id: "sample-election",
      title: "2026 TEIN-KUC Executive Election",
      description: "Sample election created by the seed script.",
      status: "DRAFT",
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      positions: {
        create: [
          {
            title: "President",
            candidates: {
              create: [{ name: "Sample Candidate A" }, { name: "Sample Candidate B" }],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded admin account: studentId=${admin.studentId}`);
  console.log(`Seeded election: ${election.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
