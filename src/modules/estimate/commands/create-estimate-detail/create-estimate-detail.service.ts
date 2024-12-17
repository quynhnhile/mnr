import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageNotFoundError } from '@modules/damage/domain/damage.error';
import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
//import { EstimateDetailCreatedUpdatedDomainEvent } from '@modules/estimate/domain/events/estimate-detail-created.domain-event';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@modules/estimate/estimate.di-tokens';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import { PayerNotFoundError } from '@modules/payer/domain/payer.error';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEstimateDetailCommand } from './create-estimate-detail.command';
import { EstimateService } from '../../services/estimate.service';
import { RepairContRepositoryPort } from '@src/modules/repair-cont/database/repair-cont.repository.port';
import { RepairContNotFoundError } from '@src/modules/repair-cont/domain/repair-cont.error';
import { REPAIR_CONT_REPOSITORY } from '@src/modules/repair-cont/repair-cont.di-tokens';

export type CreateEstimateDetailServiceResult = Result<
  EstimateDetailEntity,
  | EstimateNotFoundError
  | RepairContNotFoundError
  | ComponentNotFoundError
  | LocationNotFoundError
  | DamageNotFoundError
  | RepairNotFoundError
  | PayerNotFoundError
  | CleanMethodNotFoundError
  | CleanModeNotFoundError
>;

@CommandHandler(CreateEstimateDetailCommand)
export class CreateEstimateDetailService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    private readonly estimateRepo: EstimateRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    private readonly repairContRepo: RepairContRepositoryPort,
    @Inject(COMPONENT_REPOSITORY)
    private readonly componentRepo: ComponentRepositoryPort,
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
    @Inject(DAMAGE_REPOSITORY)
    private readonly damageRepo: DamageRepositoryPort,
    @Inject(REPAIR_REPOSITORY)
    private readonly repairRepo: RepairRepositoryPort,
    @Inject(PAYER_REPOSITORY) private readonly payerRepo: PayerRepositoryPort,
    @Inject(CLEAN_METHOD_REPOSITORY)
    private readonly cleanMethodRepo: CleanMethodRepositoryPort,
    @Inject(CLEAN_MODE_REPOSITORY)
    private readonly cleanModeRepo: CleanModeRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    protected readonly eventEmitter: EventEmitter2,
    private readonly estimateService: EstimateService,
  ) {}

  async execute(
    command: CreateEstimateDetailCommand,
  ): Promise<CreateEstimateDetailServiceResult | boolean> {
    let isUpdate = false;
    const props = command.getExtendedProps<CreateEstimateDetailCommand>();

    const {
      idEstimate,
      operationCode,
      compCode,
      locCode,
      damCode,
      repCode,
      payerCode,
      cleanMethodCode,
      cleanModeCode,
    } = props;

    const foundEstimate =
      await this.estimateRepo.findOneByIdIncludeEstimateDetails(idEstimate);
    if (foundEstimate.isNone()) {
      return Err(new EstimateNotFoundError());
    }

    const [
      foundComponent,
      foundLocation,
      foundDamage,
      foundRepair,
      foundPayer,
      foundCleanMethod,
      foundCleanMode,
    ] = await Promise.all([
      this.componentRepo.findOneByCode(compCode),
      locCode ? this.locationRepo.findOneByCode(locCode) : null,
      damCode ? this.damageRepo.findOneByCode(damCode) : null,
      this.repairRepo.findOneByCode(repCode),
      this.payerRepo.findOneByCode(payerCode),
      cleanMethodCode
        ? this.cleanMethodRepo.findOneByCode(cleanMethodCode)
        : null,
      cleanModeCode ? this.cleanModeRepo.findOneByCode(cleanModeCode) : null,
    ]);

    if (foundComponent.isNone()) {
      return Err(new ComponentNotFoundError());
    }
    if (locCode && foundLocation?.isNone()) {
      return Err(new LocationNotFoundError());
    }
    if (damCode && foundDamage?.isNone()) {
      return Err(new DamageNotFoundError());
    }
    if (foundRepair.isNone()) {
      return Err(new RepairNotFoundError());
    }
    if (foundPayer.isNone()) {
      return Err(new PayerNotFoundError());
    }
    if (cleanMethodCode && (!foundCleanMethod || foundCleanMethod?.isNone())) {
      return Err(new CleanMethodNotFoundError());
    }
    if (cleanModeCode && (!foundCleanMode || foundCleanMode?.isNone())) {
      return Err(new CleanModeNotFoundError());
    }

    const repair = foundRepair.unwrap();

    const estimate = foundEstimate.unwrap();
    const foundRepairCont = await this.repairContRepo.findOneById(
      estimate.idRef,
    );
    if (foundRepairCont.isNone()) {
      return Err(new RepairContNotFoundError());
    }
    const repairCont = foundRepairCont.unwrap();
    const estimateDetail = EstimateDetailEntity.create({
      ...props,
      isClean: repair.isClean,
      estimateNo: estimate.estimateNo,
    });

    // check nếu tạo estimate detail lần đầu thì update statusCode repairCOnt là E
    if (estimate.estimateDetails.length == 0) {
      console.log('check');
      repairCont.update({
        statusCode: 'E',
        updatedBy: command.createdBy,
      });
      isUpdate = true;
    }
    await this.estimateService.calculateTariff(estimateDetail, operationCode);

    try {
      const createdEstimateDetail = await this.estimateDetailRepo.insert(
        estimateDetail,
      );
      if (isUpdate) {
        await this.repairContRepo.update(repairCont);
      }
      /* adding "EstimateDetailCreatedUpdatedDomainEvent" Domain Event that will be published
      eventually so an event handler somewhere may receive it and do an
      appropriate action. Multiple events can be added if needed. */
      // createdEstimateDetail.addEvent(
      //   new EstimateDetailCreatedUpdatedDomainEvent({
      //     aggregateId: createdEstimateDetail.id,
      //   }),
      // );
      // // TODO: move publishEvents to a repository method
      // createdEstimateDetail.publishEvents(this.eventEmitter);

      return Ok(createdEstimateDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
