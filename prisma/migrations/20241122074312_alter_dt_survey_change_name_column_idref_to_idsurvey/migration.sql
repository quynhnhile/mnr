/*
  Warnings:

  - You are about to drop the column `id_ref` on the `dt_local_dmg_detail` table. All the data in the column will be lost.
  - Added the required column `id_survey` to the `dt_local_dmg_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_local_dmg_detail" DROP COLUMN "id_ref",
ADD COLUMN     "id_survey" BIGINT NOT NULL;
