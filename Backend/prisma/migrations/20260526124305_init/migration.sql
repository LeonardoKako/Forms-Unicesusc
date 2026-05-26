-- CreateTable
CREATE TABLE "event_bookings" (
    "id" TEXT NOT NULL,
    "controlCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "requesterType" TEXT NOT NULL,
    "requesterDepartment" TEXT,
    "adminApprovalFileUrl" TEXT,
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
    "needsBudget" BOOLEAN NOT NULL DEFAULT false,
    "budgetApprovalFileUrl" TEXT,
    "copa" TEXT[],
    "coffeeBreak" TEXT[],
    "tiEquipment" TEXT[],
    "furnitureSupport" TEXT[],
    "presentationMaterials" TEXT[],
    "needsArtwork" BOOLEAN NOT NULL DEFAULT false,
    "artworkDescription" TEXT,

    CONSTRAINT "event_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "support_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventBookingsSupportTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventBookingsSupportTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_bookings_controlCode_key" ON "event_bookings"("controlCode");

-- CreateIndex
CREATE INDEX "_EventBookingsSupportTeams_B_index" ON "_EventBookingsSupportTeams"("B");

-- AddForeignKey
ALTER TABLE "_EventBookingsSupportTeams" ADD CONSTRAINT "_EventBookingsSupportTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "event_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventBookingsSupportTeams" ADD CONSTRAINT "_EventBookingsSupportTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "support_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
