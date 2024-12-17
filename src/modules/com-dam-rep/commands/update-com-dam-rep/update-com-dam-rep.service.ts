import { Err, Ok, Result } from 'oxide.ts';
import { COM_DAM_REP_REPOSITORY } from '@modules/com-dam-rep/com-dam-rep.di-tokens';
import { ComDamRepRepositoryPort } from '@modules/com-dam-rep/database/com-dam-rep.repository.port';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import {
  ComDamRepAlreadyExistsError,
  ComDamRepNotFoundError,
} from '@modules/com-dam-rep/domain/com-dam-rep.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateComDamRepCommand } from './update-com-dam-rep.command';
import { COMPONENT_REPOSITORY } from '@src/modules/component/component.di-tokens';
import { DAMAGE_REPOSITORY } from '@src/modules/damage/damage.di-tokens';
import { REPAIR_REPOSITORY } from '@src/modules/repair/repair.di-tokens';
import { ComponentRepositoryPort } from '@src/modules/component/database/component.repository.port';
import { DamageRepositoryPort } from '@src/modules/damage/database/damage.repository.port';
import { RepairRepositoryPort } from '@src/modules/repair/database/repair.repository.port';
import { ComponentNotFoundError } from '@src/modules/component/domain/component.error';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateComDamRepServiceResult = Result<
  ComDamRepEntity,
  | ComDamRepNotFoundError
  | ComponentNotFoundError
  | DamageNotFoundError
  | RepairNotFoundError
  | ComDamRepAlreadyExistsError
>;

@CommandHandler(UpdateComDamRepCommand)
export class UpdateComDamRepService implements ICommandHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    private readonly componentRepo: ComponentRepositoryPort,
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
    @Inject(REPAIR_REPOSITORY)
    private readonly repairRepo: RepairRepositoryPort,
    @Inject(COM_DAM_REP_REPOSITORY)
    protected readonly comDamRepRepo: ComDamRepRepositoryPort,
  ) {}

  async execute(
    command: UpdateComDamRepCommand,
  ): Promise<UpdateComDamRepServiceResult> {
    const found = await this.comDamRepRepo.findOneById(command.comDamRepId);
    if (found.isNone()) {
      return Err(new ComDamRepNotFoundError());
    }

    const props = command.getExtendedProps<UpdateComDamRepCommand>();

    const { compCode, damCode, repCode } = props;
    const [foundComponent, foundDamgage, foundRepair] = await Promise.all([
      compCode
        ? this.componentRepo.findOneByCode(compCode)
        : Promise.resolve(null),
      damCode ? this.damageRepo.findOneByCode(damCode) : Promise.resolve(null),
      repCode ? this.repairRepo.findOneByCode(repCode) : Promise.resolve(null),
    ]);

    if (compCode && foundComponent?.isNone()) {
      return Err(new ComponentNotFoundError());
    }
    if (damCode && foundDamgage?.isNone()) {
      return Err(new DamageNotFoundError());
    }
    if (repCode && foundRepair?.isNone()) {
      return Err(new RepairNotFoundError());
    }

    const comDamRep = found.unwrap();
    comDamRep.update({
      ...command.getExtendedProps<UpdateComDamRepCommand>(),
    });

    try {
      const updatedComDamRep = await this.comDamRepRepo.update(comDamRep);
      return Ok(updatedComDamRep);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ComDamRepAlreadyExistsError());
      }
      throw error;
    }
  }
}
