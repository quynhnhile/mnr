import { Err, Ok, Result } from 'oxide.ts';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AprroveEstimateDetailCommand } from './approve-estimate-detail.command';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';

export type ApproveEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError
>;

@CommandHandler(AprroveEstimateDetailCommand)
export class ApproveEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: AprroveEstimateDetailCommand,
  ): Promise<ApproveEstimateDetailServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const props = command.getExtendedProps<AprroveEstimateDetailCommand>();
    const estimateDetail = found.unwrap();
    estimateDetail.approve(props);

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
