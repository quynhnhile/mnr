/*
  Warnings:

  - You are about to drop the column `status_type` on the `bs_status` table. All the data in the column will be lost.
  - You are about to alter the column `status_code` on the `bs_status` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(5)`.
  - A unique constraint covering the columns `[status_type_code,status_code]` on the table `bs_status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status_type_code` to the `bs_status` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bs_status_status_code_key";

-- AlterTable
ALTER TABLE "bs_status" DROP COLUMN "status_type",
ADD COLUMN     "status_type_code" VARCHAR(50) NOT NULL,
ALTER COLUMN "status_code" SET DATA TYPE VARCHAR(5);

-- CreateIndex
CREATE UNIQUE INDEX "bs_status_status_type_code_status_code_key" ON "bs_status"("status_type_code", "status_code");
