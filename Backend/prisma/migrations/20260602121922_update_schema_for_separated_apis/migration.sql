-- AlterTable
ALTER TABLE "event_bookings" ADD COLUMN     "coffeeNotes" TEXT,
ADD COLUMN     "hasPrintedArtwork" BOOLEAN,
ADD COLUMN     "otherCopaDescription" TEXT,
ADD COLUMN     "otherFurnitureDescription" TEXT,
ADD COLUMN     "roomNotes" TEXT,
ALTER COLUMN "eventTitle" DROP NOT NULL,
ALTER COLUMN "eventType" DROP NOT NULL,
ALTER COLUMN "eventDescription" DROP NOT NULL,
ALTER COLUMN "estimatedPublic" DROP NOT NULL,
ALTER COLUMN "coffeeBreak" DROP NOT NULL,
ALTER COLUMN "coffeeBreak" SET DATA TYPE TEXT;
