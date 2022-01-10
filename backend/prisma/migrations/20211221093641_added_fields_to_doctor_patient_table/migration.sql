/*
  Warnings:

  - You are about to drop the column `addedAt` on the `doctor_on_patient` table. All the data in the column will be lost.
  - Added the required column `requester` to the `doctor_on_patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- AlterTable
ALTER TABLE "doctor_on_patient" DROP COLUMN "addedAt",
ADD COLUMN     "acceptedTimestamp" TIMESTAMP(3),
ADD COLUMN     "requestedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requester" "Role" NOT NULL,
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT E'REQUESTED';
