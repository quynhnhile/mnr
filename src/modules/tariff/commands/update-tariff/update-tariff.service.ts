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
import {
  TariffAlreadyExistsError,
  TariffNotFoundError,
} from '@modules/tariff/domain/tariff.error';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTariffCommand } from './update-tariff.command';
import { DAMAGE_REPOSITORY } from '@src/modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@src/modules/damage/database/damage.repository.port';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';

export type UpdateTariffServiceResult = Result<
  TariffEntity,
  | TariffNotFoundError
  | TariffGroupNotFoundError
  | ComponentNotFoundError
  | LocationNotFoundError
  | RepairNotFoundError
  | DamageNotFoundError
  | TariffAlreadyExistsError
>;

@CommandHandler(UpdateTariffCommand)
export class UpdateTariffService implements ICommandHandler {
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
    command: UpdateTariffCommand,
  ): Promise<UpdateTariffServiceResult> {
    const found = await this.tariffRepo.findOneById(command.tariffId);
    if (found.isNone()) {
      return Err(new TariffNotFoundError());
    }
    const tariff = found.unwrap();

    const props = command.getExtendedProps<UpdateTariffCommand>();

    // validate if tariffGroup, component, location, damage and repair exists
    const { groupTrfCode, compCode, locCode, repCode, damCode } = props;

    const [foundRep, foundDam] = await Promise.all([
      repCode ? this.repairRepo.findOneByCode(repCode) : Promise.resolve(null),
      damCode ? this.damageRepo.findOneByCode(damCode) : Promise.resolve(null),
    ]);

    const rep = foundRep?.unwrap();
    const dam = foundDam?.unwrap();
    const foundTariffGroup = await this.tariffGroupRepo.findOneByCode(
      groupTrfCode ?? tariff.groupTrfCode,
    );
    if (foundTariffGroup?.isNone()) {
      return Err(new TariffGroupNotFoundError());
    }

    const tariffGroup = foundTariffGroup.unwrap();

    const [foundComponent, foundLocations, foundRepair, foundDamgage] =
      await Promise.all([
        compCode
          ? this.componentRepo.findOneByCode(compCode)
          : Promise.resolve(null),
        locCode
          ? this.locationRepo.findManyBycodes(locCode)
          : Promise.resolve([]),
        repCode
          ? this.repairRepo.findOneByCode(repCode, tariffGroup.operationCode)
          : Promise.resolve(null),
        damCode
          ? this.damageRepo.findOneByCode(damCode, tariffGroup.operationCode)
          : Promise.resolve(null),
      ]);

    if (compCode && foundComponent?.isNone()) {
      return Err(new ComponentNotFoundError());
    }
    if (locCode && foundLocations?.length !== locCode.length) {
      return Err(new LocationNotFoundError());
    }
    if (rep?.operationCode !== '*') {
      if (repCode && foundRepair?.isNone()) {
        return Err(new RepairNotFoundError());
      }
    }

    if (dam?.operationCode !== '*') {
      if (damCode && foundDamgage?.isNone()) {
        return Err(new DamageNotFoundError());
      }
    }

    tariff.update(props);

    try {
      const updatedTariff = await this.tariffRepo.update(tariff);
      return Ok(updatedTariff);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TariffAlreadyExistsError());
      }

      throw error;
    }
  }
}
