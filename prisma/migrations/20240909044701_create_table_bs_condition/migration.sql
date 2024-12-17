-- CreateTable
CREATE TABLE "bs_condition" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "condition_code" VARCHAR(50) NOT NULL,
    "condition_name" VARCHAR(100) NOT NULL,
    "is_damage" BOOLEAN NOT NULL,
    "is_machine" BOOLEAN NOT NULL,
    "mapping_code" VARCHAR(50) NOT NULL,
    "note" VARCHAR(200),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_condition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_condition_condition_code_key" ON "bs_condition"("condition_code");
