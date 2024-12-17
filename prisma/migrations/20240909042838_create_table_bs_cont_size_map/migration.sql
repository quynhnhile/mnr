-- CreateTable
CREATE TABLE "bs_cont_size_map" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50) NOT NULL,
    "local_size_type" VARCHAR(10) NOT NULL,
    "iso_size_type" VARCHAR(10) NOT NULL,
    "size" VARCHAR(50),
    "height" DECIMAL(18,0),
    "cont_type" VARCHAR(50) NOT NULL,
    "cont_type_name" VARCHAR(100),
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_cont_size_map_pkey" PRIMARY KEY ("id")
);
