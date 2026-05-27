/*
  Warnings:

  - You are about to drop the column `presentationMaterials` on the `event_bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_bookings" DROP COLUMN "presentationMaterials",
ADD COLUMN     "presentationDriveUrl" TEXT;
