-- CreateTable
CREATE TABLE "bs_status" (
    "id" BIGSERIAL NOT NULL,
    "status_type" VARCHAR(50) NOT NULL,
    "status_code" VARCHAR(50) NOT NULL,
    "status_name" VARCHAR(200) NOT NULL,
    "cont_type" VARCHAR(50) NOT NULL,
    "note" VARCHAR(200),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_status_status_code_key" ON "bs_status"("status_code");
