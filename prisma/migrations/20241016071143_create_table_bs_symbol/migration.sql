-- CreateTable
CREATE TABLE "bs_symbol" (
    "id" BIGSERIAL NOT NULL,
    "symbol_code" VARCHAR(50) NOT NULL,
    "symbol_name" VARCHAR(200) NOT NULL,
    "note" VARCHAR(200),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_symbol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_symbol_symbol_code_key" ON "bs_symbol"("symbol_code");
