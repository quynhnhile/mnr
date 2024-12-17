-- CreateTable
CREATE TABLE "bs_status_type" (
    "id" BIGSERIAL NOT NULL,
    "status_type_code" VARCHAR(50) NOT NULL,
    "status_type_name" VARCHAR(50) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_status_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_status_type_status_type_code_key" ON "bs_status_type"("status_type_code");
