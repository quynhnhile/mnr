/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,rep_code]` on the table `bs_repair` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_repair_operation_code_rep_code_key" ON "bs_repair"("operation_code", "rep_code");
