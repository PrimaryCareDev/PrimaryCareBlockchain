-- CreateTable
CREATE TABLE "patient" (
    "uid" VARCHAR(255) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "doctor_on_patient" (
    "doctorUid" VARCHAR(50) NOT NULL,
    "patientUid" VARCHAR(50) NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_on_patient_pkey" PRIMARY KEY ("doctorUid","patientUid")
);

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_on_patient" ADD CONSTRAINT "doctor_on_patient_doctorUid_fkey" FOREIGN KEY ("doctorUid") REFERENCES "doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_on_patient" ADD CONSTRAINT "doctor_on_patient_patientUid_fkey" FOREIGN KEY ("patientUid") REFERENCES "patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
