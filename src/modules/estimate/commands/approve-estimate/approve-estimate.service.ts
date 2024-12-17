import { Err, Ok, Result } from 'oxide.ts';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import {
  AllEstimateDetailAlreadyApprovedError,
  EstimateAlreadyApprovedError,
  EstimateNotFoundError,
} from '@modules/estimate/domain/estimate.error';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@modules/estimate/estimate.di-tokens';
import { REPAIR_CONT_REPOSITORY } from '@src/modules/repair-cont/repair-cont.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AprroveEstimateCommand } from './approve-estimate.command';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';
import { RepairContRepositoryPort } from '@src/modules/repair-cont/database/repair-cont.repository.port';
import { RepairContNotFoundError } from '@src/modules/repair-cont/domain/repair-cont.error';

export type ApproveEstimateServiceResult = Result<
  EstimateEntity,
  | EstimateNotFoundError
  | RepairContNotFoundError
  | EstimateAlreadyApprovedError
  | AllEstimateDetailAlreadyApprovedError
>;

@CommandHandler(AprroveEstimateCommand)
export class ApproveEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    command: AprroveEstimateCommand,
  ): Promise<ApproveEstimateServiceResult> {
    const found = await this.estimateRepo.findOneById(command.estimateId);
    if (found.isNone()) {
      return Err(new EstimateNotFoundError());
    }

    // find all estimate details
    const foundEstimateDetails =
      await this.estimateDetailRepo.findAllEstimateDetails({
        where: {
          idEstimate: Number(command.estimateId),
        },
        include: {
          jobRepairCleans: true,
        },
      });

    const allEstimateDetails = foundEstimateDetails
      .filter((item) => item.approvalDate == null && item.cancelDate == null)
      .map((item) => {
        return item;
      });
    if (allEstimateDetails.length == 0) {
      return Err(new AllEstimateDetailAlreadyApprovedError());
    }

    const props = command.getExtendedProps<AprroveEstimateCommand>();
    const estimate = found.unwrap();

    // find repair cont by id_ref in dt_estimate
    const foundRepairCont =
      await this.repairContRepo.findRepairContByIdRefInEstimate({
        id: estimate.idRef,
      });

    if (foundRepairCont.isNone()) {
      return Err(new RepairContNotFoundError());
    }
    const repairCont = foundRepairCont.unwrap();

    repairCont.update({
      statusCode: 'A',
      updatedBy: command.updatedBy,
    });

    for (const detail of allEstimateDetails) {
      detail.approve(props);
      await this.estimateDetailRepo.update(detail);
    }
    const approveResult = estimate.approve(props);

    if (approveResult.isErr()) {
      return approveResult;
    }

    try {
      const updatedEstimate = await this.estimateRepo.update(estimate);
      await this.repairContRepo.update(repairCont);
      return Ok(updatedEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
