import { Err, Ok, Result } from 'oxide.ts';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@modules/estimate/domain/estimate-detail.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEstimateDetailCommand } from './update-estimate-detail.command';
import { REPAIR_REPOSITORY } from '@src/modules/repair/repair.di-tokens';
import { RepairRepositoryPort } from '@src/modules/repair/database/repair.repository.port';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';
import { EstimateService } from '../../services/estimate.service';

export type UpdateEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  EstimateDetailNotFoundError | RepairNotFoundError
>;

@CommandHandler(UpdateEstimateDetailCommand)
export class UpdateEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(REPAIR_REPOSITORY)
    private readonly repairRepo: RepairRepositoryPort,
    private readonly estimateService: EstimateService,
  ) {}

  async execute(
    command: UpdateEstimateDetailCommand,
  ): Promise<UpdateEstimateDetailServiceResult> {
    const found = await this.estimateDetailRepo.findOneById(
      command.estimateDetailId,
    );
    if (found.isNone()) {
      return Err(new EstimateDetailNotFoundError());
    }

    const [foundRepair] = await Promise.all([
      command.repCode
        ? this.repairRepo.findOneByCode(command.repCode)
        : Promise.resolve(null),
    ]);

    if (command.repCode && foundRepair?.isNone()) {
      return Err(new RepairNotFoundError());
    }
    const repair = foundRepair?.unwrap();
    const estimateDetail = found.unwrap();
    console.log('check estimate detail: ', estimateDetail);

    estimateDetail.update({
      ...command.getExtendedProps<UpdateEstimateDetailCommand>(),
      isClean: repair?.isClean,
    });

    await this.estimateService.calculateTariff(
      estimateDetail,
      command.operationCode ? command.operationCode : '',
    );

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
