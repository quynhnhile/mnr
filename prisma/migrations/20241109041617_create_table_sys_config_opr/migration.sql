-- CreateTable
CREATE TABLE "sys_config_opr" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "policy_info" VARCHAR(500),
    "discount_rate" DECIMAL(18,2),
    "amount" DECIMAL(18,2),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "sys_config_opr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_config_opr_operation_code_key" ON "sys_config_opr"("operation_code");
