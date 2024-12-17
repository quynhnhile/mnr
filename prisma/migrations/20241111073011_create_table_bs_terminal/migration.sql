-- CreateTable
CREATE TABLE "bs_terminal" (
    "id" BIGSERIAL NOT NULL,
    "region_code" VARCHAR(50) NOT NULL,
    "terminal_code" VARCHAR(50) NOT NULL,
    "terminal_name" VARCHAR(100) NOT NULL,
    "terminal_name_eng" VARCHAR(100),
    "address" TEXT,
    "vat" VARCHAR(50),
    "email" VARCHAR(100),
    "tel" VARCHAR(100),
    "fax" VARCHAR(100),
    "web" VARCHAR(200),
    "hotline_info" VARCHAR(100),
    "logo_text" VARCHAR(200),
    "logoHtml" TEXT,
    "contact_name" VARCHAR(200),
    "contact_group_name" VARCHAR(200),
    "contact_tel" VARCHAR(100),
    "contact_zalo_id" VARCHAR(100),
    "contact_fb_id" VARCHAR(100),
    "contact_email" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "created_by" VARCHAR(50),
    "created_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_by" VARCHAR(50),
    "modified_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bs_terminal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bs_terminal_terminal_code_key" ON "bs_terminal"("terminal_code");
