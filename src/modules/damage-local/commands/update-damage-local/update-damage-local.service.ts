import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_LOCAL_REPOSITORY } from '@modules/damage-local/damage-local.di-tokens';
import { DamageLocalRepositoryPort } from '@modules/damage-local/database/damage-local.repository.port';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import {
  DamageLocalCodeAlreadyExistError,
  DamageLocalNotFoundError,
} from '@modules/damage-local/domain/damage-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDamageLocalCommand } from './update-damage-local.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateDamageLocalServiceResult = Result<
  DamageLocalEntity,
  DamageLocalNotFoundError | DamageLocalCodeAlreadyExistError
>;

@CommandHandler(UpdateDamageLocalCommand)
export class UpdateDamageLocalService implements ICommandHandler {
  constructor(
    @Inject(DAMAGE_LOCAL_REPOSITORY)
    protected readonly damageLocalRepo: DamageLocalRepositoryPort,
  ) {}

  async execute(
    command: UpdateDamageLocalCommand,
  ): Promise<UpdateDamageLocalServiceResult> {
    const found = await this.damageLocalRepo.findOneById(command.damageLocalId);
    if (found.isNone()) {
      return Err(new DamageLocalNotFoundError());
    }

    const damageLocal = found.unwrap();
    damageLocal.update({
      ...command.getExtendedProps<UpdateDamageLocalCommand>(),
    });

    try {
      const updatedDamageLocal = await this.damageLocalRepo.update(damageLocal);
      return Ok(updatedDamageLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new DamageLocalCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
