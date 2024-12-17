-- CreateTable
CREATE TABLE "bs_classify" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "classify_code" VARCHAR(50) NOT NULL,
    "classify_name" VARCHAR(100) NOT NULL,
    "mapping_code" VARCHAR(50) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_classify_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_classify_classify_code_key" ON "bs_classify"("classify_code");
