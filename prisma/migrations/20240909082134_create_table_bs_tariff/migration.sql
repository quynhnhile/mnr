-- CreateTable
CREATE TABLE "bs_tariff" (
    "id" BIGSERIAL NOT NULL,
    "group_trf_code" VARCHAR(50) NOT NULL,
    "comp_code" VARCHAR(50) NOT NULL,
    "loc_code" VARCHAR(50),
    "dam_code" VARCHAR(50) NOT NULL,
    "rep_code" VARCHAR(50) NOT NULL,
    "length" DECIMAL(18,2) NOT NULL,
    "width" DECIMAL(18,2) NOT NULL,
    "unit" VARCHAR(5) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "hours" DECIMAL(18,2) NOT NULL,
    "currency" VARCHAR(5) NOT NULL,
    "mate_amount" DECIMAL(18,2) NOT NULL,
    "vat" DECIMAL(5,2),
    "include_vat" BOOLEAN NOT NULL,
    "add" DECIMAL(18,2),
    "add_hours" DECIMAL(18,2),
    "add_mate" DECIMAL(18,2),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_tariff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_tariff_group_trf_code_key" ON "bs_tariff"("group_trf_code");
