/*
  Warnings:

  - A unique constraint covering the columns `[comp_code,dam_code,rep_code]` on the table `bs_com_dam_rep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_com_dam_rep_comp_code_dam_code_rep_code_key" ON "bs_com_dam_rep"("comp_code", "dam_code", "rep_code");
