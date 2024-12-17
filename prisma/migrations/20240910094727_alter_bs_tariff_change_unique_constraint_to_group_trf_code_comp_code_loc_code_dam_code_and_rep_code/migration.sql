/*
  Warnings:

  - A unique constraint covering the columns `[group_trf_code,comp_code,loc_code,dam_code,rep_code]` on the table `bs_tariff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bs_tariff_group_trf_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "bs_tariff_group_trf_code_comp_code_loc_code_dam_code_rep_co_key" ON "bs_tariff"("group_trf_code", "comp_code", "loc_code", "dam_code", "rep_code");
