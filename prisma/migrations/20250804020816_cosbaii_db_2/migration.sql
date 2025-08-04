/*
  Warnings:

  - You are about to drop the column `mimType` on the `photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."photos" DROP COLUMN "mimType",
ADD COLUMN     "mimeType" TEXT;
