-- CreateTable
CREATE TABLE "bs_location_local" (
    "id" BIGSERIAL NOT NULL,
    "group_loc_local_code" VARCHAR(50) NOT NULL,
    "loc_local_code" VARCHAR(50) NOT NULL,
    "loc_local_name_en" VARCHAR(500) NOT NULL,
    "loc_local_name_vi" VARCHAR(500),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_location_local_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_location_local_group_loc_local_code_loc_local_code_key" ON "bs_location_local"("group_loc_local_code", "loc_local_code");
