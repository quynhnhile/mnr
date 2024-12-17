/*
  Warnings:

  - Added the required column `mapping_tos` to the `bs_payer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bs_payer" ADD COLUMN     "mapping_tos" VARCHAR(50) NOT NULL;
