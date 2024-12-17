import { Err, Ok, Result } from 'oxide.ts';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LocalAprroveEstimateDetailCommand } from './local-approve-estimate-detail.command';

export type LocalApproveEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError
>;

@CommandHandler(LocalAprroveEstimateDetailCommand)
export class LocalApproveEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: LocalAprroveEstimateDetailCommand,
  ): Promise<LocalApproveEstimateDetailServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const props = command.getExtendedProps<LocalAprroveEstimateDetailCommand>();
    const estimateDetail = found.unwrap();
    estimateDetail.approveLocal(props);

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
