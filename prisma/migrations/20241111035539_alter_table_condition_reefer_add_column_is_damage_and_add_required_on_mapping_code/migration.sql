/*
  Warnings:

  - Added the required column `is_damage` to the `bs_condition_reefer` table without a default value. This is not possible if the table is not empty.
  - Made the column `mapping_code` on table `bs_condition_reefer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bs_condition_reefer" ADD COLUMN     "is_damage" BOOLEAN NOT NULL,
ALTER COLUMN "mapping_code" SET NOT NULL;
