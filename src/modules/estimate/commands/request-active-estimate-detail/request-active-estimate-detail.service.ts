import { Err, Ok, Result } from 'oxide.ts';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { RequestActiveEstimateDetailCommand } from './request-active-estimate-detail.command';

export type RequestActiveEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError
>;

@CommandHandler(RequestActiveEstimateDetailCommand)
export class RequestActiveEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  async execute(
    command: RequestActiveEstimateDetailCommand,
  ): Promise<RequestActiveEstimateDetailServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const props =
      command.getExtendedProps<RequestActiveEstimateDetailCommand>();
    const estimateDetail = found.unwrap();
    estimateDetail.requestActive(props);

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
