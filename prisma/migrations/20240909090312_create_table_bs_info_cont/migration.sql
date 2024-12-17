-- CreateTable
CREATE TABLE "bs_info_cont" (
    "id" BIGSERIAL NOT NULL,
    "container_no" VARCHAR(50) NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "owner_code" VARCHAR(20) NOT NULL,
    "local_size_type" VARCHAR(10),
    "iso_size_type" VARCHAR(10),
    "cont_type" VARCHAR(50),
    "cont_age" TIMESTAMPTZ(3),
    "machine_age" TIMESTAMPTZ(3),
    "machine_brand" VARCHAR(100),
    "machine_model" VARCHAR(100),
    "tare_weight" DECIMAL(18,2),
    "max_gross_weight" DECIMAL(18,2),
    "net_weight" DECIMAL(18,2),
    "capacity" DECIMAL(18,2),
    "last_test" TIMESTAMPTZ(3),
    "type_test" VARCHAR(20),
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_info_cont_pkey" PRIMARY KEY ("id")
);
