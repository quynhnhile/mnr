/*
  Warnings:

  - You are about to drop the column `is_lf` on the `bs_operation` table. All the data in the column will be lost.

*/
-- AddColumn
ALTER TABLE "bs_operation" ADD COLUMN "is_local_foreign" VARCHAR(5) DEFAULT 'L';

-- CopyDate
UPDATE "bs_operation" SET "is_local_foreign" = 'L' WHERE "is_lf" IS TRUE;
UPDATE "bs_operation" SET "is_local_foreign" = 'F' WHERE "is_lf" IS FALSE;

-- AlterTable
ALTER TABLE "bs_operation" DROP COLUMN "is_lf";
