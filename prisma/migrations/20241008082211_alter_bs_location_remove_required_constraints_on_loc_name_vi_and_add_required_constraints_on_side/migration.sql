/*
  Warnings:

  - Made the column `side` on table `bs_location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_location" ALTER COLUMN "loc_name_th" DROP NOT NULL,
ALTER COLUMN "side" SET NOT NULL;
