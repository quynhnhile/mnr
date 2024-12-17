-- CreateTable
CREATE TABLE "bs_agent" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "agent_code" VARCHAR(50) NOT NULL,
    "agent_name" VARCHAR(50) NOT NULL,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_agent_operation_code_agent_code_key" ON "bs_agent"("operation_code", "agent_code");
