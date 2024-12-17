-- CreateTable
CREATE TABLE "bs_damage" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50),
    "dam_code" VARCHAR(50) NOT NULL,
    "dam_name_en" VARCHAR(200) NOT NULL,
    "dam_name_vi" VARCHAR(200) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_damage_pkey" PRIMARY KEY ("id")
);
