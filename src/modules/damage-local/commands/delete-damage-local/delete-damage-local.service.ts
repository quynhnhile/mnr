import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { DAMAGE_LOCAL_REPOSITORY } from '@modules/damage-local/damage-local.di-tokens';
import { DamageLocalRepositoryPort } from '@modules/damage-local/database/damage-local.repository.port';
import { DamageLocalEntity } from '@modules/damage-local/domain/damage-local.entity';
import { DamageLocalNotFoundError } from '@modules/damage-local/domain/damage-local.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDamageLocalCommand } from './delete-damage-local.command';

export type DeleteDamageLocalServiceResult = Result<boolean, DamageLocalNotFoundError>;

@CommandHandler(DeleteDamageLocalCommand)
export class DeleteDamageLocalService implements ICommandHandler {
  constructor(
    @Inject(DAMAGE_LOCAL_REPOSITORY)
    protected readonly damageLocalRepo: DamageLocalRepositoryPort,
  ) {}

  async execute(
    command: DeleteDamageLocalCommand,
  ): Promise<DeleteDamageLocalServiceResult> {
    try {
      const result = await this.damageLocalRepo.delete({
        id: command.damageLocalId,
      } as DamageLocalEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new DamageLocalNotFoundError(error));
      }

      throw error;
    }
  }
}
