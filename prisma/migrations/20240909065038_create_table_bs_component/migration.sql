-- CreateTable
CREATE TABLE "bs_component" (
    "id" BIGSERIAL NOT NULL,
    "operation_code" VARCHAR(50),
    "comp_code" VARCHAR(50) NOT NULL,
    "comp_name_en" VARCHAR(200) NOT NULL,
    "comp_name_vi" VARCHAR(200) NOT NULL,
    "assembly" VARCHAR(200) NOT NULL,
    "side" VARCHAR(100) NOT NULL,
    "cont_type" VARCHAR(100) NOT NULL,
    "material_code" VARCHAR(50) NOT NULL,
    "is_machine" BOOLEAN DEFAULT false,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_component_pkey" PRIMARY KEY ("id")
);
