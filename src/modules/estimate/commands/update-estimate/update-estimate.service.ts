import { Err, Ok, Result } from 'oxide.ts';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEstimateCommand } from './update-estimate.command';

export type UpdateEstimateServiceResult = Result<
  EstimateEntity,
  EstimateNotFoundError
>;

@CommandHandler(UpdateEstimateCommand)
export class UpdateEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
  ) {}

  async execute(
    command: UpdateEstimateCommand,
  ): Promise<UpdateEstimateServiceResult> {
    const foundEstimate = await this.estimateRepo.findOneById(
      command.estimateId,
    );
    if (foundEstimate.isNone()) {
      return Err(new EstimateNotFoundError());
    }

    const estimate = foundEstimate.unwrap();

    const props = command.getExtendedProps<UpdateEstimateCommand>();
    const { altEstimateNo } = props;

    if (altEstimateNo) {
      const foundAltEstimate = await this.estimateRepo.findOneByNumber({
        estimateNo: altEstimateNo,
        idRef: estimate.idRef,
      });

      if (foundAltEstimate.isSome()) {
        return Err(new EstimateNotFoundError());
      }
    }

    estimate.update({
      ...command.getExtendedProps<UpdateEstimateCommand>(),
    });

    try {
      const updatedEstimate = await this.estimateRepo.update(estimate);
      return Ok(updatedEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
