import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import {
  DamageCodeAlreadyInUseError,
  DamageNotFoundError,
} from '@modules/damage/domain/damage.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDamageCommand } from './delete-damage.command';

export type DeleteDamageServiceResult = Result<
  boolean,
  DamageNotFoundError | DamageCodeAlreadyInUseError
>;

@CommandHandler(DeleteDamageCommand)
export class DeleteDamageService implements ICommandHandler {
  constructor(
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
  ) {}

  async execute(
    command: DeleteDamageCommand,
  ): Promise<DeleteDamageServiceResult> {
    const found = await this.damageRepo.findOneByIdWithInUseCount(
      command.damageId,
    );
    if (found.isNone()) {
      return Err(new DamageNotFoundError());
    }

    const damage = found.unwrap();
    const deleteResult = damage.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.damageRepo.delete({
        id: command.damageId,
      } as DamageEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new DamageNotFoundError(error));
      }

      throw error;
    }
  }
}
