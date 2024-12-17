import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import {
  ConditionCodeAlreadyInUseError,
  ConditionNotFoundError,
} from '@modules/condition/domain/condition.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteConditionCommand } from './delete-condition.command';

export type DeleteConditionServiceResult = Result<
  boolean,
  ConditionNotFoundError | ConditionCodeAlreadyInUseError
>;

@CommandHandler(DeleteConditionCommand)
export class DeleteConditionService implements ICommandHandler {
  constructor(
    @Inject(CONDITION_REPOSITORY)
    protected readonly conditionRepo: ConditionRepositoryPort,
  ) {}

  async execute(
    command: DeleteConditionCommand,
  ): Promise<DeleteConditionServiceResult> {
    const found = await this.conditionRepo.findOneByIdWithInUseCount(
      command.conditionId,
    );
    if (found.isNone()) {
      return Err(new ConditionNotFoundError());
    }

    const condition = found.unwrap();
    const deleteResult = condition.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.conditionRepo.delete(condition);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ConditionNotFoundError(error));
      }

      throw error;
    }
  }
}
