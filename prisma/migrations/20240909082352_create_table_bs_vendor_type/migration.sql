-- CreateTable
CREATE TABLE "bs_vendor_type" (
    "id" BIGSERIAL NOT NULL,
    "vendor_type_code" VARCHAR(50) NOT NULL,
    "vendor_type_name" VARCHAR(200) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_vendor_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_vendor_type_vendor_type_code_key" ON "bs_vendor_type"("vendor_type_code");
