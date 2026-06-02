/*
  Warnings:

  - You are about to drop the `_EventBookingsSupportTeams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_bookings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventBookingsSupportTeams" DROP CONSTRAINT "_EventBookingsSupportTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventBookingsSupportTeams" DROP CONSTRAINT "_EventBookingsSupportTeams_B_fkey";

-- DropTable
DROP TABLE "_EventBookingsSupportTeams";

-- DropTable
DROP TABLE "event_bookings";

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "controlCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "requesterType" TEXT NOT NULL,
    "requesterDepartment" TEXT NOT NULL,
    "isPartnerEvent" BOOLEAN NOT NULL DEFAULT false,
    "partnerName" TEXT,
    "partnerEmail" TEXT,
    "partnerPhone" TEXT,
    "partnerInstitution" TEXT,
    "eventTitle" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDescription" TEXT NOT NULL,
    "targetAudience" TEXT[],
    "estimatedPublic" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "selectedRoom" TEXT NOT NULL,
    "roomNotes" TEXT,
    "needsBudget" BOOLEAN NOT NULL DEFAULT false,
    "budgetApprovalFileUrl" TEXT,
    "copa" TEXT[],
    "otherCopaDescription" TEXT,
    "coffeeBreak" TEXT NOT NULL,
    "coffeeNotes" TEXT,
    "tiEquipment" TEXT[],
    "furnitureSupport" TEXT[],
    "otherFurnitureDescription" TEXT,
    "presentationMaterials" TEXT[],
    "presentationDriveLink" TEXT,
    "needsArtwork" BOOLEAN NOT NULL DEFAULT false,
    "hasPrintedArtwork" BOOLEAN,
    "artworkDescription" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "controlCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "requesterType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "selectedRoom" TEXT NOT NULL,
    "roomNotes" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventsSupportTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventsSupportTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LocationsSupportTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LocationsSupportTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_controlCode_key" ON "events"("controlCode");

-- CreateIndex
CREATE UNIQUE INDEX "locations_controlCode_key" ON "locations"("controlCode");

-- CreateIndex
CREATE INDEX "_EventsSupportTeams_B_index" ON "_EventsSupportTeams"("B");

-- CreateIndex
CREATE INDEX "_LocationsSupportTeams_B_index" ON "_LocationsSupportTeams"("B");

-- AddForeignKey
ALTER TABLE "_EventsSupportTeams" ADD CONSTRAINT "_EventsSupportTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsSupportTeams" ADD CONSTRAINT "_EventsSupportTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "support_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationsSupportTeams" ADD CONSTRAINT "_LocationsSupportTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationsSupportTeams" ADD CONSTRAINT "_LocationsSupportTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "support_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
