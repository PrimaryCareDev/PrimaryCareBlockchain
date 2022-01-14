-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "sex" "Sex",
ADD COLUMN     "verified" BOOLEAN DEFAULT false;
