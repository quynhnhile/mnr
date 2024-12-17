-- CreateTable
CREATE TABLE "bs_com_dam_rep" (
    "id" BIGSERIAL NOT NULL,
    "comp_code" VARCHAR(50) NOT NULL,
    "dam_code" VARCHAR(50) NOT NULL,
    "rep_code" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_vi" VARCHAR(200) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_com_dam_rep_pkey" PRIMARY KEY ("id")
);
