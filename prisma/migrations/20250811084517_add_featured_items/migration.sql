/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `badges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `badges` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `badges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `iconUrl` on table `badges` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "public"."BadgeType" ADD VALUE 'PROFILE_COMPLETION';

-- AlterTable
ALTER TABLE "public"."badges" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "iconUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."competitions" ADD COLUMN     "eventUrl" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "referenceLinks" TEXT;

-- AlterTable
ALTER TABLE "public"."notifications" ADD COLUMN     "data" TEXT;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "coverImagePublicId" TEXT,
ADD COLUMN     "profilePicturePublicId" TEXT,
ALTER COLUMN "profilePicture" SET DEFAULT '/images/default-avatar.png';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isPremiumUser" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."featured_items" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "character" TEXT,
    "series" TEXT,
    "type" TEXT NOT NULL DEFAULT 'cosplay',
    "competitionId" INTEGER,
    "position" TEXT,
    "award" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "featured_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "public"."badges"("name");

-- AddForeignKey
ALTER TABLE "public"."featured_items" ADD CONSTRAINT "featured_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."featured_items" ADD CONSTRAINT "featured_items_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
