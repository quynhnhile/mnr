-- CreateTable
CREATE TABLE "dt_survey_detail" (
    "id" BIGSERIAL NOT NULL,
    "id_survey" BIGINT NOT NULL,
    "id_cont" VARCHAR(50) NOT NULL,
    "container_no" VARCHAR(50) NOT NULL,
    "survey_no" VARCHAR(50) NOT NULL,
    "survey_date" TIMESTAMPTZ(3) NOT NULL,
    "survey_by" VARCHAR(36) NOT NULL,
    "note_survey" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_survey_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dt_survey" (
    "id" BIGSERIAL NOT NULL,
    "id_rep" BIGINT NOT NULL,
    "id_cont" VARCHAR(50) NOT NULL,
    "container_no" VARCHAR(50) NOT NULL,
    "survey_no" VARCHAR(50) NOT NULL,
    "eir_no" VARCHAR(50),
    "fe" VARCHAR(50),
    "is_in_out" VARCHAR(1) NOT NULL DEFAULT 'I',
    "survey_location" VARCHAR(20) NOT NULL,
    "cont_age" TIMESTAMPTZ(3),
    "machine_age" TIMESTAMPTZ(3),
    "machine_brand" VARCHAR(100),
    "machine_model" VARCHAR(100),
    "condition_code" VARCHAR(50),
    "condition_machine_code" VARCHAR(50),
    "classify_code" VARCHAR(50),
    "clean_method_code" VARCHAR(50) NOT NULL,
    "clean_mode_code" VARCHAR(50) NOT NULL,
    "deposit" DECIMAL(18,2),
    "vendor_code" VARCHAR(50) NOT NULL,
    "id_check" BIGINT,
    "check_no" VARCHAR(50),
    "is_tank_outside" BOOLEAN DEFAULT false,
    "is_tank_inside" BOOLEAN DEFAULT false,
    "is_test_1bar" BOOLEAN DEFAULT false,
    "pre_survey_no" VARCHAR(50),
    "survey_date" TIMESTAMPTZ(3) NOT NULL,
    "survey_by" VARCHAR(36) NOT NULL,
    "finish_date" TIMESTAMPTZ(3),
    "finish_by" VARCHAR(36),
    "is_remove_mark" BOOLEAN DEFAULT false,
    "is_revice" BOOLEAN DEFAULT false,
    "alt_survey_no" VARCHAR(50),
    "note_survey" TEXT,
    "note_cont" TEXT,
    "note_dam" TEXT,
    "note_special_handling" TEXT,
    "note_eir" TEXT,
    "note" TEXT,
    "is_exception" BOOLEAN DEFAULT false,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "dt_survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dt_survey_detail_survey_no_key" ON "dt_survey_detail"("survey_no");

-- CreateIndex
CREATE UNIQUE INDEX "dt_survey_survey_no_key" ON "dt_survey"("survey_no");

-- AddForeignKey
ALTER TABLE "dt_survey_detail" ADD CONSTRAINT "dt_survey_detail_id_survey_fkey" FOREIGN KEY ("id_survey") REFERENCES "dt_survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
