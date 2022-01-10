/*
  Warnings:

  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "doctor_user_uid_fk";

-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_uid_fkey";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRoles";

-- CreateTable
CREATE TABLE "doctor" (
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
CREATE TABLE "user" (
    "uid" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "avatarImageUrl" VARCHAR(255),

    CONSTRAINT "user_pk" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "uid" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("uid","role")
);

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "UserRoles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
