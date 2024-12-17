import { Err, Ok, Result } from 'oxide.ts';
import { COM_DAM_REP_REPOSITORY } from '@modules/com-dam-rep/com-dam-rep.di-tokens';
import { ComDamRepRepositoryPort } from '@modules/com-dam-rep/database/com-dam-rep.repository.port';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateComDamRepCommand } from './create-com-dam-rep.command';
import { COMPONENT_REPOSITORY } from '@src/modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@src/modules/component/database/component.repository.port';
import { REPAIR_REPOSITORY } from '@src/modules/repair/repair.di-tokens';
import { RepairRepositoryPort } from '@src/modules/repair/database/repair.repository.port';
import { DAMAGE_REPOSITORY } from '@src/modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@src/modules/damage/database/damage.repository.port';
import { ComponentNotFoundError } from '@src/modules/component/domain/component.error';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';
import { DamageNotFoundError } from '@src/modules/damage/domain/damage.error';
import { ConflictException } from '@src/libs/exceptions';
import { ComDamRepAlreadyExistsError } from '../../domain/com-dam-rep.error';

export type CreateComDamRepServiceResult = Result<
  ComDamRepEntity,
  | ComponentNotFoundError
  | DamageNotFoundError
  | RepairNotFoundError
  | ComDamRepAlreadyExistsError
>;

@CommandHandler(CreateComDamRepCommand)
export class CreateComDamRepService implements ICommandHandler {
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
    command: CreateComDamRepCommand,
  ): Promise<CreateComDamRepServiceResult> {
    const props = command.getExtendedProps<CreateComDamRepCommand>();

    const { compCode, damCode, repCode } = props;
    const [foundComponent, foundDamgage, foundRepair] = await Promise.all([
      this.componentRepo.findOneByCode(compCode),
      this.damageRepo.findOneByCode(damCode),
      this.repairRepo.findOneByCode(repCode),
    ]);

    if (foundComponent.isNone()) {
      return Err(new ComponentNotFoundError());
    }
    if (foundDamgage.isNone()) {
      return Err(new DamageNotFoundError());
    }
    if (foundRepair.isNone()) {
      return Err(new RepairNotFoundError());
    }

    const comDamRep = ComDamRepEntity.create(props);

    try {
      const createdComDamRep = await this.comDamRepRepo.insert(comDamRep);
      return Ok(createdComDamRep);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ComDamRepAlreadyExistsError());
      }

      throw error;
    }
  }
}
