-- CreateTable
CREATE TABLE "bs_group_location_local" (
    "id" BIGSERIAL NOT NULL,
    "group_loc_local_code" VARCHAR(50) NOT NULL,
    "group_loc_local_name" VARCHAR(500) NOT NULL,
    "cont_type" VARCHAR(50) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_group_location_local_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_group_location_local_group_loc_local_code_key" ON "bs_group_location_local"("group_loc_local_code");
