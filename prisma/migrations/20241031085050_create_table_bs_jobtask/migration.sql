-- CreateTable
CREATE TABLE "bs_jobtask" (
    "id" BIGSERIAL NOT NULL,
    "jobtask_code" VARCHAR(50) NOT NULL,
    "jobtask_name" VARCHAR(100) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_jobtask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_jobtask_jobtask_code_key" ON "bs_jobtask"("jobtask_code");
