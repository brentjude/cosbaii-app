-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "pendingEmailExpires" TIMESTAMP(3),
ADD COLUMN     "pendingEmailToken" TEXT;
