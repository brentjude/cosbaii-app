/*
  Warnings:

  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CompetitionType" AS ENUM ('GENERAL', 'ARMOR', 'CLOTH', 'SINGING');

-- CreateEnum
CREATE TYPE "public"."RivalryType" AS ENUM ('SOLO', 'DUO', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."CompetitionLevel" AS ENUM ('BARANGAY', 'LOCAL', 'REGIONAL', 'NATIONAL', 'WORLDWIDE');

-- AlterTable
ALTER TABLE "public"."competitions" ADD COLUMN     "competitionType" "public"."CompetitionType" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "level" "public"."CompetitionLevel" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "rivalryType" "public"."RivalryType" NOT NULL DEFAULT 'SOLO';

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "data",
DROP COLUMN "read",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "relatedId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."profiles" ALTER COLUMN "profilePicture" SET DEFAULT '/images/default-avatar,png',
ALTER COLUMN "coverImage" SET DEFAULT '/images/default-cover.jpg';

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
