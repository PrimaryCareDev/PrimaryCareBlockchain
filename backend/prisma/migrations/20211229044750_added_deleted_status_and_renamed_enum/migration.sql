/*
  Warnings:

  - The `status` column on the `doctor_on_patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "doctor_on_patient" DROP COLUMN "status",
ADD COLUMN     "status" "RelationshipStatus" NOT NULL DEFAULT E'REQUESTED';

-- DropEnum
DROP TYPE "RequestStatus";
