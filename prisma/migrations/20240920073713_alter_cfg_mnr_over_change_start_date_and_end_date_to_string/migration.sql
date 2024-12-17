/*
  Warnings:

  - You are about to alter the column `status_code` on the `dt_estimate_detail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "cfg_mnr_over" ALTER COLUMN "start_date" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "end_date" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "dt_estimate_detail" ALTER COLUMN "status_code" SET DATA TYPE VARCHAR(5);
