/*
  Warnings:

  - Made the column `operation_code` on table `bs_repair` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_repair" ALTER COLUMN "operation_code" SET NOT NULL;
