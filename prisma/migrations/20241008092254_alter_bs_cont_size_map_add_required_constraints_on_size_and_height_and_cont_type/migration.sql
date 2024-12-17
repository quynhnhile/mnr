/*
  Warnings:

  - Made the column `size` on table `bs_cont_size_map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `bs_cont_size_map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cont_type` on table `bs_cont_size_map` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_cont_size_map" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "cont_type" SET NOT NULL;
