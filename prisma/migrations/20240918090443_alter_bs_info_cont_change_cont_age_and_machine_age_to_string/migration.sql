/*
  Warnings:

  - The `cont_age` column on the `bs_info_cont` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machine_age` column on the `bs_info_cont` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cont_age` column on the `dt_survey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machine_age` column on the `dt_survey` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bs_info_cont" DROP COLUMN "cont_age",
ADD COLUMN     "cont_age" VARCHAR(10),
DROP COLUMN "machine_age",
ADD COLUMN     "machine_age" VARCHAR(10);

-- AlterTable
ALTER TABLE "dt_survey" DROP COLUMN "cont_age",
ADD COLUMN     "cont_age" VARCHAR(10),
DROP COLUMN "machine_age",
ADD COLUMN     "machine_age" VARCHAR(10);
