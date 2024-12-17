-- CreateTable
CREATE TABLE "bs_damage_local" (
    "id" BIGSERIAL NOT NULL,
    "dam_local_code" VARCHAR(50) NOT NULL,
    "dam_local_name_en" VARCHAR(200) NOT NULL,
    "dam_local_name_vi" VARCHAR(200),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_damage_local_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_damage_local_dam_local_code_key" ON "bs_damage_local"("dam_local_code");
