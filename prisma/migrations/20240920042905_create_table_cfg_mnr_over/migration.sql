-- CreateTable
CREATE TABLE "cfg_mnr_over" (
    "id" BIGSERIAL NOT NULL,
    "status_type_code" VARCHAR(50) NOT NULL,
    "cont_type" VARCHAR(50) NOT NULL,
    "job_mode_code" VARCHAR(50) NOT NULL,
    "method_code" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMPTZ(3) NOT NULL,
    "end_date" TIMESTAMPTZ(3) NOT NULL,
    "pti" VARCHAR(50),
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "cfg_mnr_over_pkey" PRIMARY KEY ("id")
);
