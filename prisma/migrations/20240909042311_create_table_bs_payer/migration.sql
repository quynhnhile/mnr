-- CreateTable
CREATE TABLE "bs_payer" (
    "id" BIGSERIAL NOT NULL,
    "payer_code" VARCHAR(50) NOT NULL,
    "payer_name" VARCHAR(200) NOT NULL,
    "note" VARCHAR(200),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_payer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_payer_payer_code_key" ON "bs_payer"("payer_code");
