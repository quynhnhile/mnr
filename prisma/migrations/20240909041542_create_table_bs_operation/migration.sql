-- CreateTable
CREATE TABLE "bs_operation" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "operation_name" VARCHAR(100) NOT NULL,
    "is_edo" BOOLEAN NOT NULL DEFAULT false,
    "is_lf" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "money_credit" VARCHAR(10) DEFAULT 'M',
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_operation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_operation_operation_code_key" ON "bs_operation"("operation_code");
