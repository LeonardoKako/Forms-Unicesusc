-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "adminRejectionReason" TEXT,
ADD COLUMN     "adminVerification" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "authorVerification" TEXT NOT NULL DEFAULT 'pending';
