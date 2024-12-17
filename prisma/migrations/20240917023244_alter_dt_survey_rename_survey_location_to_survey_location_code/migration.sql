/*
  Warnings:

  - You are about to drop the column `survey_location` on the `dt_survey` table. All the data in the column will be lost.
  - Added the required column `survey_location_code` to the `dt_survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dt_survey" DROP COLUMN "survey_location",
ADD COLUMN     "survey_location_code" VARCHAR(50) NOT NULL;
