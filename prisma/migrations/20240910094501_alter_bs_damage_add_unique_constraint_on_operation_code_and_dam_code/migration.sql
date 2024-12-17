/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,dam_code]` on the table `bs_damage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_damage_operation_code_dam_code_key" ON "bs_damage"("operation_code", "dam_code");
