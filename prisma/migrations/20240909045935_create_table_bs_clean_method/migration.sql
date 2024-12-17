-- CreateTable
CREATE TABLE "bs_clean_method" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "clean_method_code" VARCHAR(50) NOT NULL,
    "clean_method_name" VARCHAR(100) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_clean_method_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_clean_method_operation_code_clean_method_code_key" ON "bs_clean_method"("operation_code", "clean_method_code");
