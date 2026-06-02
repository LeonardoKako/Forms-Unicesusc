-- AlterTable
ALTER TABLE "events" ADD COLUMN     "adminVerification" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "authorVerification" TEXT NOT NULL DEFAULT 'pending';
