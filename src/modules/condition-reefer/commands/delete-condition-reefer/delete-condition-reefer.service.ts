import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CONDITION_REEFER_REPOSITORY } from '@modules/condition-reefer/condition-reefer.di-tokens';
import { ConditionReeferRepositoryPort } from '@modules/condition-reefer/database/condition-reefer.repository.port';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import { ConditionReeferNotFoundError } from '@modules/condition-reefer/domain/condition-reefer.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteConditionReeferCommand } from './delete-condition-reefer.command';

export type DeleteConditionReeferServiceResult = Result<boolean, ConditionReeferNotFoundError>;

@CommandHandler(DeleteConditionReeferCommand)
export class DeleteConditionReeferService implements ICommandHandler {
  constructor(
    @Inject(CONDITION_REEFER_REPOSITORY)
    protected readonly conditionReeferRepo: ConditionReeferRepositoryPort,
  ) {}

  async execute(
    command: DeleteConditionReeferCommand,
  ): Promise<DeleteConditionReeferServiceResult> {
    try {
      const result = await this.conditionReeferRepo.delete({
        id: command.conditionReeferId,
      } as ConditionReeferEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ConditionReeferNotFoundError(error));
      }

      throw error;
    }
  }
}
