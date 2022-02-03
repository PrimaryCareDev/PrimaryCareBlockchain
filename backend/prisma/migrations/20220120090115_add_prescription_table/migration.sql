-- CreateTable
CREATE TABLE "prescription" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "drugName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "unitsPerDose" TEXT NOT NULL,
    "totalUnits" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
