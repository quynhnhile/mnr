-- CreateTable
CREATE TABLE "bs_survey_location" (
    "id" BIGSERIAL NOT NULL,
    "survey_location_code" VARCHAR(50) NOT NULL,
    "survey_location_name" VARCHAR(200) NOT NULL,
    "note" TEXT,
    "created_date" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMPTZ(3),
    "modified_by" VARCHAR(36),

    CONSTRAINT "bs_survey_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_survey_location_survey_location_code_key" ON "bs_survey_location"("survey_location_code");
