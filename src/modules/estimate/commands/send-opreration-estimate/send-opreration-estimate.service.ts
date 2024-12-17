import { Err, Ok, Result } from 'oxide.ts';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import {
  AllEstimateDetailAlreadySendOprError,
  EstimateAlreadySentOperationError,
  EstimateNotFoundError,
} from '@modules/estimate/domain/estimate.error';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendOprerationEstimateCommand } from './send-opreration-estimate.command';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';

export type SendOprerationEstimateServiceResult = Result<
  EstimateEntity,
  | EstimateNotFoundError
  | EstimateAlreadySentOperationError
  | AllEstimateDetailAlreadySendOprError
>;

@CommandHandler(SendOprerationEstimateCommand)
export class SendOprerationEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: SendOprerationEstimateCommand,
  ): Promise<SendOprerationEstimateServiceResult> {
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
      .filter((item) => item.cancelDate == null)
      .map((item) => {
        return item;
      });
    if (allEstimateDetails.length == 0) {
      return Err(new AllEstimateDetailAlreadySendOprError());
    }

    const props = command.getExtendedProps<SendOprerationEstimateCommand>();
    const estimate = found.unwrap();
    const sendOperationResult = estimate.sendOperation(props);
    if (sendOperationResult.isErr()) {
      return sendOperationResult;
    }

    try {
      const updatedEstimate = await this.estimateRepo.update(estimate);
      return Ok(updatedEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
