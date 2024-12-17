import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEstimateDetailCommand } from './delete-estimate-detail.command';

export type DeleteEstimateDetailServiceResult = Result<
  boolean,
  EstimateDetailNotFoundError
>;

@CommandHandler(DeleteEstimateDetailCommand)
export class DeleteEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: DeleteEstimateDetailCommand,
  ): Promise<DeleteEstimateDetailServiceResult> {
    try {
      const result = await this.estimateDetailRepo.delete({
        id: command.estimateDetailId,
      } as EstimateDetailEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new EstimateDetailNotFoundError(error));
      }

      throw error;
    }
  }
}
