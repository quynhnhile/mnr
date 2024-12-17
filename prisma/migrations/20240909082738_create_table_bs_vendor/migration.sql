-- CreateTable
CREATE TABLE "bs_vendor" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50),
    "vendor_type_code" VARCHAR(50) NOT NULL,
    "vendor_code" VARCHAR(50) NOT NULL,
    "vendor_name" VARCHAR(200),
    "is_active" BOOLEAN DEFAULT true,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_vendor_vendor_code_key" ON "bs_vendor"("vendor_code");
