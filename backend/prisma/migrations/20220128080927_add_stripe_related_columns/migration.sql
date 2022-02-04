-- AlterTable
ALTER TABLE "memo" ADD COLUMN     "patientHasAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "updatedAt" DROP NOT NULL;
