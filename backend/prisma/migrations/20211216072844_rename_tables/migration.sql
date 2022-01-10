/*
  Warnings:

  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_uid_fkey";

-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_user_uid_fk";

-- DropTable
DROP TABLE "doctor";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "Doctor" (
    "uid" VARCHAR(255) NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "submittedForVerification" BOOLEAN DEFAULT false,
    "idImageUrl" VARCHAR(512),
    "medicalPractice" VARCHAR(255),
    "medicalLicenseNumber" VARCHAR(255),
    "licenseImageUrl" VARCHAR(512),

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "User" (
    "uid" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "avatarImageUrl" VARCHAR(255),

    CONSTRAINT "user_pk" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "doctor_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
