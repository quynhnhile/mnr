-- CreateTable
CREATE TABLE "bs_condition_reefer" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "condition_code" VARCHAR(50) NOT NULL,
    "condition_machine_code" VARCHAR(50) NOT NULL,
    "mapping_code" VARCHAR(50),
    "note" VARCHAR(200),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_condition_reefer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_condition_reefer_operation_code_condition_code_condition_key" ON "bs_condition_reefer"("operation_code", "condition_code", "condition_machine_code");
