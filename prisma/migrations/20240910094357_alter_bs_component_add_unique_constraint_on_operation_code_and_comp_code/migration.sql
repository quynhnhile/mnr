/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,comp_code]` on the table `bs_component` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_component_operation_code_comp_code_key" ON "bs_component"("operation_code", "comp_code");
