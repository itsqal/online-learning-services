/*
  Warnings:

  - You are about to drop the column `currentEnrollments` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "currentEnrollments",
DROP COLUMN "progress";
