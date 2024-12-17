import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REEFER_REPOSITORY } from '@modules/condition-reefer/condition-reefer.di-tokens';
import { ConditionReeferRepositoryPort } from '@modules/condition-reefer/database/condition-reefer.repository.port';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import {
  ConditionReeferCodeAlreadyExistsError,
  ConditionReeferNotFoundError,
} from '@modules/condition-reefer/domain/condition-reefer.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateConditionReeferCommand } from './update-condition-reefer.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateConditionReeferServiceResult = Result<
  ConditionReeferEntity,
  ConditionReeferNotFoundError | ConditionReeferCodeAlreadyExistsError
>;

@CommandHandler(UpdateConditionReeferCommand)
export class UpdateConditionReeferService implements ICommandHandler {
  constructor(
    @Inject(CONDITION_REEFER_REPOSITORY)
    protected readonly conditionReeferRepo: ConditionReeferRepositoryPort,
  ) {}

  async execute(
    command: UpdateConditionReeferCommand,
  ): Promise<UpdateConditionReeferServiceResult> {
    const found = await this.conditionReeferRepo.findOneById(
      command.conditionReeferId,
    );
    if (found.isNone()) {
      return Err(new ConditionReeferNotFoundError());
    }

    const conditionReefer = found.unwrap();
    conditionReefer.update({
      ...command.getExtendedProps<UpdateConditionReeferCommand>(),
    });

    try {
      const updatedConditionReefer = await this.conditionReeferRepo.update(
        conditionReefer,
      );
      return Ok(updatedConditionReefer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ConditionReeferCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
