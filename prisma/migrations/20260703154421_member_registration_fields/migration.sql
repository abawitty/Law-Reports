-- AlterTable
ALTER TABLE "User" ADD COLUMN     "constituency" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "hasVotersId" BOOLEAN,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "signature" TEXT,
ADD COLUMN     "surname" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- CreateTable
CREATE TABLE "MemberPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberPhoto_userId_key" ON "MemberPhoto"("userId");

-- AddForeignKey
ALTER TABLE "MemberPhoto" ADD CONSTRAINT "MemberPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
