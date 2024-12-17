import { Err, Ok, Result } from 'oxide.ts';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateJobRepairCleanCommand } from './create-job-repair-clean.command';
import { REPAIR_CONT_REPOSITORY } from '@src/modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@src/modules/repair-cont/database/repair-cont.repository.port';
import { RepairContNotFoundError } from '@src/modules/repair-cont/domain/repair-cont.error';
import { generateIdJob } from '../../utils/generate-id-job.util';
import { VENDOR_REPOSITORY } from '@src/modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@src/modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';
import { ESTIMATE_DETAIL_REPOSITORY } from '@src/modules/estimate/estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '@src/modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';
import { JobRepairCleanNotFoundError } from '../../domain/job-repair-clean.error';

export type CreateJobRepairCleanServiceResult = Result<
  JobRepairCleanEntity,
  | RepairContNotFoundError
  | EstimateDetailNotFoundError
  | VendorNotFoundError
  | JobRepairCleanNotFoundError
>;

@CommandHandler(CreateJobRepairCleanCommand)
export class CreateJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    private readonly repairContRepo: RepairContRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    private readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: CreateJobRepairCleanCommand,
  ): Promise<CreateJobRepairCleanServiceResult> {
    const props = command.getExtendedProps<CreateJobRepairCleanCommand>();

    const { idRef, idEstItem, vendorCode, isReclean, idRefReclean } = props;

    const [
      foundRepairCont,
      foundEstimateDetail,
      foundVendor,
      foundPrejobRepairClean,
    ] = await Promise.all([
      this.repairContRepo.findOneById(idRef),
      this.estimateDetailRepo.findOneById(idEstItem),
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
      isReclean && idRefReclean
        ? this.jobRepairCleanRepo.findOneById(idRefReclean)
        : Promise.resolve(null),
    ]);

    if (foundRepairCont.isNone()) {
      return Err(new RepairContNotFoundError());
    }

    if (foundEstimateDetail.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    if (vendorCode && foundVendor?.isNone()) {
      return Err(new VendorNotFoundError());
    }

    if (
      isReclean &&
      (!idRefReclean ||
        !foundPrejobRepairClean ||
        foundPrejobRepairClean?.isNone())
    ) {
      return Err(new JobRepairCleanNotFoundError());
    }

    const repairContEntity = foundRepairCont.unwrap();
    const estimateDetailEntity = foundEstimateDetail.unwrap();
    const preJobRepairClean = foundPrejobRepairClean?.unwrap();
    if (isReclean && foundPrejobRepairClean && preJobRepairClean) {
      const jobRepairClean = JobRepairCleanEntity.create({
        ...props,
        idCont: repairContEntity.idCont,
        containerNo: repairContEntity.containerNo,
        estimateNo: estimateDetailEntity.estimateNo,
        idJob: preJobRepairClean.idJob,
        seq: preJobRepairClean.seq + 1,
        repCode: preJobRepairClean.repCode,
        isClean: false,
        cleanMethodCode: estimateDetailEntity.cleanMethodCode,
        cleanModeCode: estimateDetailEntity.cleanModeCode,
        startBy: props.createdBy,
        startDate: new Date(),
        idRefReclean: preJobRepairClean.id,
        recleanReason: props.recleanReason,
        isReclean: true,
        jobStatus: 'R',
        kcsStatus: 0,
      });

      // preJobRepairClean.update({
      //   recleanReason: props.recleanReason,
      //   isReclean: true,
      //   updatedBy: props.createdBy,
      // });
      try {
        const createdJobRepairClean = await this.jobRepairCleanRepo.insert(
          jobRepairClean,
        );
        //await this.jobRepairCleanRepo.update(preJobRepairClean);
        return Ok(createdJobRepairClean);
      } catch (error: any) {
        throw error;
      }
    } else {
      const jobRepairClean = JobRepairCleanEntity.create({
        ...props,
        idCont: repairContEntity.idCont,
        containerNo: repairContEntity.containerNo,
        estimateNo: estimateDetailEntity.estimateNo,
        idJob: generateIdJob(),
        seq: 1,
        repCode: estimateDetailEntity.repCode,
        isClean: estimateDetailEntity.isClean,
        cleanMethodCode: estimateDetailEntity.cleanMethodCode,
        cleanModeCode: estimateDetailEntity.cleanModeCode,
        isReclean: false,
        jobStatus: 'R',
        kcsStatus: 0,
      });

      try {
        const createdJobRepairClean = await this.jobRepairCleanRepo.insert(
          jobRepairClean,
        );
        return Ok(createdJobRepairClean);
      } catch (error: any) {
        throw error;
      }
    }
  }
}
