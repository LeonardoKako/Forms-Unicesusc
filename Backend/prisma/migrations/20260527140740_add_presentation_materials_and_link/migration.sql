/*
  Warnings:

  - You are about to drop the column `presentationDriveUrl` on the `event_bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_bookings" DROP COLUMN "presentationDriveUrl",
ADD COLUMN     "presentationDriveLink" TEXT,
ADD COLUMN     "presentationMaterials" TEXT[];
