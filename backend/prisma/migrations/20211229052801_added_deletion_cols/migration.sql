-- AlterTable
ALTER TABLE "doctor_on_patient" ADD COLUMN     "deleteTimestamp" TIMESTAMP(3),
ADD COLUMN     "deleter" "Role";
