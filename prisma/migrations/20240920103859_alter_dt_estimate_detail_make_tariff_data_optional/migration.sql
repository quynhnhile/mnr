-- AlterTable
ALTER TABLE "dt_estimate_detail" ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "hours" DROP NOT NULL,
ALTER COLUMN "cwo" DROP NOT NULL,
ALTER COLUMN "labor_rate" DROP NOT NULL,
ALTER COLUMN "labor_price" DROP NOT NULL,
ALTER COLUMN "mate_price" DROP NOT NULL,
ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "currency" DROP NOT NULL;
