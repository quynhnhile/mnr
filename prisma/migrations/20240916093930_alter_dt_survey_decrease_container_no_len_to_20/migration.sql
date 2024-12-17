/*
  Warnings:

  - You are about to alter the column `container_no` on the `dt_survey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "dt_survey" ALTER COLUMN "container_no" SET DATA TYPE VARCHAR(20);
