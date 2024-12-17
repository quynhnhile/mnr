-- CreateTable
CREATE TABLE "bs_clean_mode" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "clean_mode_code" VARCHAR(50) NOT NULL,
    "clean_mode_name" VARCHAR(100) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_clean_mode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_clean_mode_operation_code_clean_mode_code_key" ON "bs_clean_mode"("operation_code", "clean_mode_code");
