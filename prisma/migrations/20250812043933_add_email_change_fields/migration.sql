-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "pendingEmail" TEXT;
