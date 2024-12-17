-- CreateTable
CREATE TABLE "dt_local_dmg_detail" (
    "id" BIGSERIAL NOT NULL,
    "id_ref" BIGINT NOT NULL,
    "id_cont" VARCHAR(50) NOT NULL,
    "dam_local_code" VARCHAR(50) NOT NULL,
    "loc_local_code" VARCHAR(50) NOT NULL,
    "symbol_code" VARCHAR(50) NOT NULL,
    "size" DECIMAL(10,2) NOT NULL,
    "damDesc" TEXT,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_local_dmg_detail_pkey" PRIMARY KEY ("id")
);
