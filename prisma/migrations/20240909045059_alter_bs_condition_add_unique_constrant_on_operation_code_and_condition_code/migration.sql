/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,condition_code]` on the table `bs_condition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bs_condition_condition_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "bs_condition_operation_code_condition_code_key" ON "bs_condition"("operation_code", "condition_code");
