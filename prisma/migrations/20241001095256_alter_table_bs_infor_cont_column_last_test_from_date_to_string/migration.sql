/*
  Warnings:

  - You are about to drop the column `last_test` on the `bs_info_cont` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bs_info_cont" DROP COLUMN "last_test",
ADD COLUMN     "lastTest" TEXT;
