-- CreateTable
CREATE TABLE "bs_repair" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50),
    "rep_code" VARCHAR(50) NOT NULL,
    "rep_name_en" VARCHAR(200) NOT NULL,
    "rep_name_vi" VARCHAR(200) NOT NULL,
    "is_clean" BOOLEAN NOT NULL,
    "is_repair" BOOLEAN NOT NULL,
    "is_pti" BOOLEAN NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_repair_pkey" PRIMARY KEY ("id")
);
