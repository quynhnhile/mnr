import { Err, Ok, Result } from 'oxide.ts';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelEstimateDetailCommand } from './cancel-estimate-detail.command';

export type CancelEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError
>;

@CommandHandler(CancelEstimateDetailCommand)
export class CancelEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: CancelEstimateDetailCommand,
  ): Promise<CancelEstimateDetailServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const props = command.getExtendedProps<CancelEstimateDetailCommand>();
    const estimateDetail = found.unwrap();
    estimateDetail.cancel(props);

    try {
      const updatedEstimateDetail = await this.estimateDetailRepo.update(
        estimateDetail,
      );
      return Ok(updatedEstimateDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
