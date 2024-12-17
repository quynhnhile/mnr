-- DropIndex
DROP INDEX "dt_survey_detail_survey_no_key";

-- AlterTable
ALTER TABLE "dt_survey_detail" ADD COLUMN     "note" TEXT;
