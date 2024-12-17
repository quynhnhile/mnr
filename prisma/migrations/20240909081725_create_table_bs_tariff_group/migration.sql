-- CreateTable
CREATE TABLE "bs_tariff_group" (
    "id" BIGSERIAL NOT NULL,
    "group_trf_code" VARCHAR(50) NOT NULL,
    "group_trf_name" VARCHAR(200),
    "labor_rate" DECIMAL(8,2) NOT NULL,
    "is_dry" BOOLEAN NOT NULL DEFAULT false,
    "is_reefer" BOOLEAN NOT NULL DEFAULT false,
    "is_tank" BOOLEAN NOT NULL DEFAULT false,
    "operation_code" VARCHAR(50),
    "vendor_code" VARCHAR(50),
    "is_terminal" BOOLEAN DEFAULT false,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_tariff_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_tariff_group_group_trf_code_key" ON "bs_tariff_group"("group_trf_code");
