import { Err, Ok, Result } from 'oxide.ts';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { EstimateStatus } from '@modules/estimate/domain/estimate.type';
import { EstimateDetailCreatedUpdatedDomainEvent } from '@modules/estimate/domain/events/estimate-detail-created.domain-event';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateService } from '../../services/estimate.service';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEstimateCommand } from './create-estimate.command';

export type CreateEstimateServiceResult = Result<
  EstimateEntity,
  RepairContNotFoundError | EstimateNotFoundError
>;

@CommandHandler(CreateEstimateCommand)
export class CreateEstimateService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    private readonly repairContRepo: RepairContRepositoryPort,
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    protected readonly eventEmitter: EventEmitter2,
    private readonly estimateService: EstimateService,
  ) {}

  async execute(
    command: CreateEstimateCommand,
  ): Promise<CreateEstimateServiceResult> {
    const props = command.getExtendedProps<CreateEstimateCommand>();

    const { idRef, altEstimateNo, estimateDetails = [] } = props;

    const [foundRepairCont, foundAltEstimate] = await Promise.all([
      this.repairContRepo.findOneById(idRef),
      altEstimateNo
        ? this.estimateRepo.findOneByNumber({
            estimateNo: altEstimateNo,
            idRef,
          })
        : null,
    ]);
    if (foundRepairCont.isNone()) {
      return Err(new RepairContNotFoundError());
    }
    if (altEstimateNo && (!foundAltEstimate || foundAltEstimate.isNone())) {
      return Err(new EstimateNotFoundError());
    }

    const repairCont = foundRepairCont.unwrap();
    const prefix = 'E';
    const estimateNo = await this.estimateService.generateEstimateNo(prefix);

    const estimate = EstimateEntity.create({
      ...props,
      idCont: repairCont.idCont,
      containerNo: repairCont.containerNo,
      statusCode: EstimateStatus.ESTIMATE,
      estimateDate: new Date(),
      estimateNo,
      estimateDetails: estimateDetails.map((detail) => ({
        ...detail,
        estimateNo,
        createdBy: props.createdBy,
      })),
    });

    // update estimateNo to repairCont
    repairCont.update({
      estimateNo,
      statusCode: EstimateStatus.ESTIMATE,
      updatedBy: props.createdBy,
    });

    try {
      const createdEstimate = await this.estimateRepo.createEstimate(estimate);
      await this.repairContRepo.update(repairCont);

      // if estimate includes estimate details, add EstimateDetailCreatedUpdatedDomainEvent event
      if (createdEstimate?.estimateDetails.length) {
        createdEstimate.estimateDetails.forEach((estimateDetail) => {
          new EstimateDetailCreatedUpdatedDomainEvent({
            aggregateId: estimateDetail.id,
            aggregateOpr: props.operationCode,
          });
        });
        // TODO: move publishEvents to a repository method
        createdEstimate.publishEvents(this.eventEmitter);
      }

      return Ok(createdEstimate);
    } catch (error: any) {
      throw error;
    }
  }
}
