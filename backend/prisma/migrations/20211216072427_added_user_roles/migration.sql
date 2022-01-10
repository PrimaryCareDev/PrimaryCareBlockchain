-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'PATIENT', 'ADMIN');

-- CreateTable
CREATE TABLE "doctor" (
    "uid" VARCHAR(255) NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "submittedForVerification" BOOLEAN DEFAULT false,
    "idImageUrl" VARCHAR(512),
    "medicalPractice" VARCHAR(255),
    "medicalLicenseNumber" VARCHAR(255),
    "licenseImageUrl" VARCHAR(512),

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("uid")
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
CREATE TABLE "UserRoles" (
    "uid" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("uid","role")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_uid_key" ON "UserRoles"("uid");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
