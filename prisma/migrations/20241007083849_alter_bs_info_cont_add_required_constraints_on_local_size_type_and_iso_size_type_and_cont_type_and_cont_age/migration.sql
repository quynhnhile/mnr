/*
  Warnings:

  - Made the column `local_size_type` on table `bs_info_cont` required. This step will fail if there are existing NULL values in that column.
  - Made the column `iso_size_type` on table `bs_info_cont` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cont_type` on table `bs_info_cont` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cont_age` on table `bs_info_cont` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_info_cont" ALTER COLUMN "local_size_type" SET NOT NULL,
ALTER COLUMN "iso_size_type" SET NOT NULL,
ALTER COLUMN "cont_type" SET NOT NULL,
ALTER COLUMN "cont_age" SET NOT NULL;
