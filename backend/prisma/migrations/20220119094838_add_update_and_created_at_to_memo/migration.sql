/*
  Warnings:

  - You are about to drop the column `description` on the `diagnosis` table. All the data in the column will be lost.
  - Added the required column `title` to the `diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `memo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diagnosis" DROP COLUMN "description",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "memo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
