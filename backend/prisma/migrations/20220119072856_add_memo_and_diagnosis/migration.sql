-- CreateTable
CREATE TABLE "memo" (
    "id" SERIAL NOT NULL,
    "patientUid" VARCHAR(50) NOT NULL,
    "doctorUid" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "memo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "doctorUid" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "diagnosis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "memo" ADD CONSTRAINT "memo_patientUid_fkey" FOREIGN KEY ("patientUid") REFERENCES "patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memo" ADD CONSTRAINT "memo_doctorUid_fkey" FOREIGN KEY ("doctorUid") REFERENCES "doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
