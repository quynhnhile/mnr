/*
  Warnings:

  - Made the column `length` on table `bs_tariff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `bs_tariff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_tariff" ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL;
