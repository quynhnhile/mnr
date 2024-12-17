import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import {
  DamageCodeAlreadyInUseError,
  DamageCodeAndOperationCodeAlreadyExistError,
  DamageNotFoundError,
} from '@modules/damage/domain/damage.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDamageCommand } from './update-damage.command';
import { ConflictException } from '@src/libs/exceptions';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

export type UpdateDamageServiceResult = Result<
  DamageEntity,
  | DamageNotFoundError
  | OperationNotFoundError
  | DamageCodeAlreadyInUseError
  | DamageCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(UpdateDamageCommand)
export class UpdateDamageService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
  ) {}

  async execute(
    command: UpdateDamageCommand,
  ): Promise<UpdateDamageServiceResult> {
    const found = await this.damageRepo.findOneById(command.damageId);
    if (found.isNone()) {
      return Err(new DamageNotFoundError());
    }

    const props = command.getExtendedProps<UpdateDamageCommand>();

    const damage = found.unwrap();
    const updateResult = damage.update(props);
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedDamage = await this.damageRepo.update(damage);
      return Ok(updatedDamage);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new DamageCodeAndOperationCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
