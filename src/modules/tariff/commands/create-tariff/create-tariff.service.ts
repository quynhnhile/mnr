import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { LocationRepositoryPort } from '@modules/location/database/location.repository.port';
import { LocationNotFoundError } from '@modules/location/domain/location.error';
import { LOCATION_REPOSITORY } from '@modules/location/location.di-tokens';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairNotFoundError } from '@modules/repair/domain/repair.error';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TariffGroupNotFoundError } from '@modules/tariff-group/domain/tariff-group.error';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { TariffRepositoryPort } from '@modules/tariff/database/tariff.repository.port';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { TariffAlreadyExistsError } from '@modules/tariff/domain/tariff.error';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTariffCommand } from './create-tariff.command';
import { DAMAGE_REPOSITORY } from '@src/modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@src/modules/damage/database/damage.repository.port';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';

export type CreateTariffServiceResult = Result<
  TariffEntity,
  | TariffGroupNotFoundError
  | ComponentNotFoundError
  | LocationNotFoundError
  | RepairNotFoundError
  | DamageNotFoundError
  | TariffAlreadyExistsError
>;

@CommandHandler(CreateTariffCommand)
export class CreateTariffService implements ICommandHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    private readonly componentRepo: ComponentRepositoryPort,
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
    @Inject(REPAIR_REPOSITORY)
    private readonly repairRepo: RepairRepositoryPort,
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
    @Inject(TARIFF_GROUP_REPOSITORY)
    private readonly tariffGroupRepo: TariffGroupRepositoryPort,
    @Inject(TARIFF_REPOSITORY)
    protected readonly tariffRepo: TariffRepositoryPort,
  ) {}

  async execute(
    command: CreateTariffCommand,
  ): Promise<CreateTariffServiceResult> {
    const props = command.getExtendedProps<CreateTariffCommand>();

    // validate if tariffGroup, component, location, damage and repair exists
    const { groupTrfCode, compCode, locCode, repCode, damCode } = props;

    const foundTariffGroup = await this.tariffGroupRepo.findOneByCode(
      groupTrfCode,
    );
    if (foundTariffGroup.isNone()) {
      return Err(new TariffGroupNotFoundError());
    }

    const foundRep = await this.repairRepo.findOneByCode(repCode);
    const foundDam = damCode
      ? await this.damageRepo.findOneByCode(damCode)
      : null;
    const rep = foundRep.unwrap();
    const dam = foundDam?.unwrap();

    const tariffGroup = foundTariffGroup.unwrap();

    const [foundComponent, foundLocations, foundRepair, foundDamgage] =
      await Promise.all([
        this.componentRepo.findOneByCode(compCode),
        locCode
          ? this.locationRepo.findManyBycodes(locCode)
          : Promise.resolve(null),
        this.repairRepo.findOneByCode(repCode, tariffGroup.operationCode),
        damCode
          ? this.damageRepo.findOneByCode(damCode, tariffGroup.operationCode)
          : Promise.resolve(null),
      ]);

    if (foundComponent.isNone()) {
      return Err(new ComponentNotFoundError());
    }
    if (locCode && foundLocations?.length !== locCode.length) {
      return Err(new LocationNotFoundError());
    }
    if (rep.operationCode !== '*') {
      if (foundRepair.isNone()) {
        return Err(new RepairNotFoundError());
      }
    }

    if (dam?.operationCode !== '*') {
      if (damCode && foundDamgage?.isNone()) {
        return Err(new DamageNotFoundError());
      }
    }

    const tariff = TariffEntity.create({
      ...props,
      damCode: props.damCode ?? null,
    });

    try {
      const createdTariff = await this.tariffRepo.insert(tariff);
      return Ok(createdTariff);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TariffAlreadyExistsError());
      }

      throw error;
    }
  }
}
