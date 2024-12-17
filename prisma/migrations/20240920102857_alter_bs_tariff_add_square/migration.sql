-- AlterTable
ALTER TABLE "bs_tariff" ADD COLUMN "square" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- Fill in the new column with the calculated values
UPDATE "bs_tariff" SET "square" = "length" * "width";