/*
  Warnings:

  - You are about to alter the column `status_code` on the `dt_estimate_detail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "dt_estimate_detail" ALTER COLUMN "status_code" SET DATA TYPE VARCHAR(5);

-- AlterTable
ALTER TABLE "job_repair_clean" ALTER COLUMN "id_est_item" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "job_repair_clean" ADD CONSTRAINT "job_repair_clean_id_est_item_fkey" FOREIGN KEY ("id_est_item") REFERENCES "dt_estimate_detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
