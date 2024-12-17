import { Err, Ok, Result } from 'oxide.ts';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import {
  AllEstimateDetailAlreadyLocalApprovedError,
  EstimateAlreadyLocalApprovedError,
  EstimateNotFoundError,
} from '@modules/estimate/domain/estimate.error';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LocalAprroveCommand } from './local-approve-estimate.command';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';

export type LocalApproveEstimateServiceResult = Result<
  EstimateEntity,
  | EstimateNotFoundError
  | EstimateAlreadyLocalApprovedError
  | AllEstimateDetailAlreadyLocalApprovedError
>;

@CommandHandler(LocalAprroveCommand)
export class LocalApproveEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: LocalAprroveCommand,
  ): Promise<LocalApproveEstimateServiceResult> {
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
      .filter(
        (item) => item.localApprovalDate == null && item.cancelDate == null,
      )
      .map((item) => {
        return item;
      });
    if (allEstimateDetails.length == 0) {
      return Err(new AllEstimateDetailAlreadyLocalApprovedError());
    }

    const props = command.getExtendedProps<LocalAprroveCommand>();
    const estimate = found.unwrap();

    for (const detail of allEstimateDetails) {
      detail.approveLocal(props);
      await this.estimateDetailRepo.update(detail);
    }
    const approveLocalResult = estimate.approveLocal(props);
    if (approveLocalResult.isErr()) {
      return approveLocalResult;
    }

    try {
      const updatedEstimate = await this.estimateRepo.update(estimate);
      return Ok(updatedEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
