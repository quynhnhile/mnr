import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StartJobRepairCleanItemCommand } from './start-job-repair-clean-item.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../../job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '../../database/job-repair-clean.repository.port';
import { JobRepairCleanAlreadyStartedOrCanceledError } from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@src/modules/estimate/estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '@src/modules/estimate/database/estimate-detail.repository.port';
import {
  EstimateDetailNotFoundError,
  EstimateDetailRequiredFieldError,
} from '@src/modules/estimate/domain/estimate-detail.error';
import { VENDOR_REPOSITORY } from '@src/modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@src/modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';
import { EstimateRepositoryPort } from '@src/modules/estimate/database/estimate.repository.port';
import { EstimateNotFoundError } from '@src/modules/estimate/domain/estimate.error';
import { JobRepairCleanService } from '../../services/job-repair-clean.service';

export type StartJobRepairCleanItemServiceResult = Result<
  JobRepairCleanEntity,
  | EstimateDetailNotFoundError
  | EstimateDetailRequiredFieldError
  | EstimateNotFoundError
  | VendorNotFoundError
  | JobRepairCleanAlreadyStartedOrCanceledError
>;

@CommandHandler(StartJobRepairCleanItemCommand)
export class StartJobRepairCleanItemService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
    private readonly jobRepairCleanService: JobRepairCleanService,
  ) {}

  async execute(
    command: StartJobRepairCleanItemCommand,
  ): Promise<StartJobRepairCleanItemServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const props = command.getExtendedProps<StartJobRepairCleanItemCommand>();

    //------------------------------
    //check vendor code
    const { vendorCode } = props;

    const [foundVenorCode] = await Promise.all([
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
    ]);

    if (vendorCode && foundVenorCode?.isNone()) {
      return Err(new VendorNotFoundError());
    }

    //------------------------------
    //estimate detail
    const foundEstimateDetail = await this.estimateDetailRepo.getOneById(
      command.estimateDetailId,
    );
    const estimateDetail = foundEstimateDetail.unwrap();
    if (!estimateDetail.isRead) {
      return Err(new EstimateDetailRequiredFieldError());
    }

    const foundEstimate = await this.estimateRepo.findOneById(
      estimateDetail.idEstimate,
    );

    if (foundEstimate.isNone()) {
      return Err(new EstimateNotFoundError());
    }

    const estimate = foundEstimate.unwrap();

    // if (
    //   estimateDetail.localApprovalDate == null &&
    //   estimateDetail.localApprovalBy == null &&
    //   estimateDetail.approvalDate == null &&
    //   estimateDetail.approvalBy == null &&
    //   estimateDetail.reqActiveDate == null &&
    //   estimateDetail.reqActiveBy == null
    // ) {
    //   return Err(new EstimateDetailCanNotStartError());
    // }

    if (estimateDetail.jobRepairCleans.length != 0) {
      return Err(new JobRepairCleanAlreadyStartedOrCanceledError());
    }
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
    const startResult = jobRepairClean.start(props);
    if (startResult.isErr()) {
      return startResult;
    }

    try {
      const createdJobRepairClean =
        await this.jobRepairCleanRepo.createJobRepairClean(jobRepairClean);
      return Ok(createdJobRepairClean);
    } catch (error: any) {
      throw error;
    }
  }
}
