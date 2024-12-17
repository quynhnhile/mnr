/*
  Warnings:

  - Made the column `vendor_name` on table `bs_vendor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_vendor" ALTER COLUMN "vendor_name" SET NOT NULL;
