import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StartAllJobCommand } from './start-all-job.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@src/modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@src/modules/job-repair-clean/database/job-repair-clean.repository.port';
import {
  EstimateIsNotAvailableToCompleteAllError,
  EstimateNotFoundError,
} from '../../domain/estimate.error';
import { EstimateRepositoryPort } from '../../database/estimate.repository.port';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '../../estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';
import { RepairContRepositoryPort } from '@src/modules/repair-cont/database/repair-cont.repository.port';
import { REPAIR_CONT_REPOSITORY } from '@src/modules/repair-cont/repair-cont.di-tokens';
import { JobRepairCleanEntity } from '@src/modules/job-repair-clean/domain/job-repair-clean.entity';
import { VENDOR_REPOSITORY } from '@src/modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@src/modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';
import { EstimateDetailRequiredFieldError } from '../../domain/estimate-detail.error';
import {
  AllJobRepairCleanAlreadyStartedError,
  JobRepairCleanAlreadyStartedError,
} from '@src/modules/job-repair-clean/domain/job-repair-clean.error';
import { JobRepairCleanService } from '../../../job-repair-clean/services/job-repair-clean.service';

export type StartAllJobServiceResult = Result<
  JobRepairCleanEntity[],
  | EstimateNotFoundError
  | VendorNotFoundError
  | AllJobRepairCleanAlreadyStartedError
  | EstimateDetailRequiredFieldError
  | JobRepairCleanAlreadyStartedError
  | EstimateIsNotAvailableToCompleteAllError
>;

@CommandHandler(StartAllJobCommand)
export class StartAllJobService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
    private readonly jobRepairCleanService: JobRepairCleanService,
  ) {}

  async execute(
    command: StartAllJobCommand,
  ): Promise<StartAllJobServiceResult> {
    // find estimate by id
    const foundEstimate = await this.estimateRepo.findOneById(
      command.estimateId,
    );
    if (foundEstimate.isNone()) {
      return Err(new EstimateNotFoundError());
    }
    const estimate = foundEstimate.unwrap();

    const props = command.getExtendedProps<StartAllJobCommand>();
    const { vendorCode } = props;
    const [foundVenorCode] = await Promise.all([
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
    ]);

    if (vendorCode && foundVenorCode?.isNone()) {
      return Err(new VendorNotFoundError());
    }

    // find all estimate details
    const foundEstimateDetails =
      await this.estimateDetailRepo.findAllEstimateDetails({
        where: {
          idEstimate: Number(estimate.id),
        },
        include: {
          jobRepairCleans: true,
        },
      });

    const allEstimateDetails = foundEstimateDetails
      .filter(
        (item) =>
          item.jobRepairCleans.length == 0 &&
          item.cancelBy == null &&
          item.cancelDate == null &&
          (item.approvalBy !== null ||
            item.approvalDate !== null ||
            item.reqActiveBy !== null ||
            item.reqActiveDate !== null),
      )
      .map((item) => {
        return item;
      });

    if (allEstimateDetails.length == 0) {
      return Err(new AllJobRepairCleanAlreadyStartedError());
    }

    console.log('check all: ', allEstimateDetails);

    // const hasMissingFields = allEstimateDetails.some((estimateDetail) => {
    //   return (
    //     estimateDetail.localApprovalDate == null &&
    //     estimateDetail.localApprovalBy == null &&
    //     estimateDetail.approvalDate == null &&
    //     estimateDetail.approvalBy == null &&
    //     estimateDetail.reqActiveDate == null &&
    //     estimateDetail.reqActiveBy == null
    //   );
    // });

    // if (hasMissingFields) {
    //   return Err(new AllEstimateDetailCanNotStartError());
    // }

    if (allEstimateDetails.some((item) => !item.isRead)) {
      return Err(new EstimateDetailRequiredFieldError());
    }

    // if (
    //   allEstimateDetails.some((item) => {
    //     console.log(
    //       `jobRepairCleans.length for item: ${item.jobRepairCleans.length}`,
    //     ); // Log length
    //     return item.jobRepairCleans.length !== 0; // Check condition
    //   })
    // ) {
    //   return Err(new JobRepairCleanAlreadyStartedError());
    // }

    //const lastIndex = await this.jobRepairCleanRepo.countCurrentIndex();

    try {
      const jobRepairCleans: JobRepairCleanEntity[] = await Promise.all(
        allEstimateDetails.map(async (estimateDetail) => {
          let prefix = 'R';

          if (estimateDetail.isClean) {
            prefix = 'C';
          }

          const jobRepairClean = JobRepairCleanEntity.create({
            ...props,
            idRef: estimate.idRef,
            idCont: estimate.idCont,
            containerNo: estimate.containerNo,
            idEstItem: estimateDetail.id,
            estimateNo: estimate.estimateNo,
            idJob: await this.jobRepairCleanService.generateIdJob(prefix),
            seq: 1,
            repCode: estimateDetail.repCode,
            isClean: estimateDetail.isClean,
            cleanMethodCode: estimateDetail.cleanMethodCode,
            cleanModeCode: estimateDetail.cleanModeCode,
            isReclean: false,
            jobStatus: 'R',
            kcsStatus: 0,
          });

          jobRepairClean.start(props);

          await this.jobRepairCleanRepo.createJobRepairClean(jobRepairClean);
          return jobRepairClean;
        }),
      );

      return Ok(jobRepairCleans);
    } catch (error) {
      throw error;
    }
  }
}
