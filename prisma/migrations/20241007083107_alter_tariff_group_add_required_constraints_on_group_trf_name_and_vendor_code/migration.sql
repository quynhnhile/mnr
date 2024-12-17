/*
  Warnings:

  - Made the column `group_trf_name` on table `bs_tariff_group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendor_code` on table `bs_tariff_group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_tariff_group" ALTER COLUMN "group_trf_name" SET NOT NULL,
ALTER COLUMN "vendor_code" SET NOT NULL;
