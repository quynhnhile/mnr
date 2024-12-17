-- CreateTable
CREATE TABLE "bs_region" (
    "id" BIGSERIAL NOT NULL,
    "region_code" VARCHAR(50) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "note" VARCHAR(100),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_region_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_region_region_code_key" ON "bs_region"("region_code");
