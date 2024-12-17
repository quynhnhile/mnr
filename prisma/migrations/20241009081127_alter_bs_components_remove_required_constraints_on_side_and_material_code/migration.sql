-- AlterTable
ALTER TABLE "bs_component" ALTER COLUMN "side" DROP NOT NULL,
ALTER COLUMN "material_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bs_info_cont" ALTER COLUMN "local_size_type" DROP NOT NULL,
ALTER COLUMN "iso_size_type" DROP NOT NULL,
ALTER COLUMN "cont_type" DROP NOT NULL,
ALTER COLUMN "cont_age" DROP NOT NULL;
