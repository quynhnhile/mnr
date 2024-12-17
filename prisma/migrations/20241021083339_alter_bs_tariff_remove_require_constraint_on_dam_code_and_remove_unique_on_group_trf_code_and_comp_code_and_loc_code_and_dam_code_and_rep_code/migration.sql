-- DropIndex
DROP INDEX "bs_tariff_group_trf_code_comp_code_loc_code_dam_code_rep_co_key";

-- AlterTable
ALTER TABLE "bs_tariff" ALTER COLUMN "dam_code" DROP NOT NULL;
