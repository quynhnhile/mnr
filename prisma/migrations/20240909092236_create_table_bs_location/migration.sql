-- CreateTable
CREATE TABLE "bs_location" (
    "id" BIGSERIAL NOT NULL,
    "loc_code" VARCHAR(50) NOT NULL,
    "loc_name_en" VARCHAR(200) NOT NULL,
    "loc_name_th" VARCHAR(200) NOT NULL,
    "side" VARCHAR(10),
    "size" DECIMAL(10,2),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_location_loc_code_key" ON "bs_location"("loc_code");
