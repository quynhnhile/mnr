import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_LOCAL_REPOSITORY } from '@modules/damage-local/damage-local.di-tokens';
import { DamageLocalRepositoryPort } from '@modules/damage-local/database/damage-local.repository.port';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDamageLocalCommand } from './create-damage-local.command';
import { ConflictException } from '@src/libs/exceptions';
import { DamageLocalCodeAlreadyExistError } from '../../domain/damage-local.error';

export type CreateDamageLocalServiceResult = Result<
  DamageLocalEntity,
  DamageLocalCodeAlreadyExistError
>;

@CommandHandler(CreateDamageLocalCommand)
export class CreateDamageLocalService implements ICommandHandler {
  constructor(
    @Inject(DAMAGE_LOCAL_REPOSITORY)
    protected readonly damageLocalRepo: DamageLocalRepositoryPort,
  ) {}

  async execute(
    command: CreateDamageLocalCommand,
  ): Promise<CreateDamageLocalServiceResult> {
    const damageLocal = DamageLocalEntity.create({
      ...command.getExtendedProps<CreateDamageLocalCommand>(),
    });

    try {
      const createdDamageLocal = await this.damageLocalRepo.insert(damageLocal);
      return Ok(createdDamageLocal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new DamageLocalCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
