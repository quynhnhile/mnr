import { Err, Ok, Result } from 'oxide.ts';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import {
  AllEstimateDetailAlreadyRequestedActiveError,
  EstimateAlreadyRequestedActiveError,
  EstimateNotFoundError,
} from '@modules/estimate/domain/estimate.error';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestActiveEstimateCommand } from './request-active-estimate.command';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';

export type RequestActiveEstimateServiceResult = Result<
  EstimateEntity,
  | EstimateNotFoundError
  | EstimateAlreadyRequestedActiveError
  | AllEstimateDetailAlreadyRequestedActiveError
>;

@CommandHandler(RequestActiveEstimateCommand)
export class RequestActiveEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: RequestActiveEstimateCommand,
  ): Promise<RequestActiveEstimateServiceResult> {
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
      .filter((item) => item.reqActiveDate == null && item.cancelDate == null)
      .map((item) => {
        return item;
      });
    if (allEstimateDetails.length == 0) {
      return Err(new AllEstimateDetailAlreadyRequestedActiveError());
    }

    const props = command.getExtendedProps<RequestActiveEstimateCommand>();
    const estimate = found.unwrap();
    for (const detail of allEstimateDetails) {
      detail.requestActive(props);
      await this.estimateDetailRepo.update(detail);
    }
    const requestActiveResult = estimate.requestActive(props);
    if (requestActiveResult.isErr()) {
      return requestActiveResult;
    }

    try {
      const updatedEstimate = await this.estimateRepo.update(estimate);
      return Ok(updatedEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
