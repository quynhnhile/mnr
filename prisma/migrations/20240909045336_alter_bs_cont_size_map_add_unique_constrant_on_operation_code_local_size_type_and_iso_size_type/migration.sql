/*
  Warnings:

  - A unique constraint covering the columns `[operation_code,local_size_type,iso_size_type]` on the table `bs_cont_size_map` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bs_cont_size_map_operation_code_local_size_type_iso_size_ty_key" ON "bs_cont_size_map"("operation_code", "local_size_type", "iso_size_type");
