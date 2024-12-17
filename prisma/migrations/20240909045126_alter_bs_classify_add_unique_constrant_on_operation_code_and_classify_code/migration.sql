/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,classify_code]` on the table `bs_classify` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bs_classify_classify_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "bs_classify_operation_code_classify_code_key" ON "bs_classify"("operation_code", "classify_code");
