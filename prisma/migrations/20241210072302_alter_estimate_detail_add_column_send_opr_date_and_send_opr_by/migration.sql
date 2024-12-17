-- AlterTable
ALTER TABLE "dt_estimate_detail" ADD COLUMN     "send_opr_by" VARCHAR(36),
ADD COLUMN     "send_opr_date" TIMESTAMPTZ(3);
