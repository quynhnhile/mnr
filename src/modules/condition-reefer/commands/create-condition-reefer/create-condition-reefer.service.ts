import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REEFER_REPOSITORY } from '@modules/condition-reefer/condition-reefer.di-tokens';
import { ConditionReeferRepositoryPort } from '@modules/condition-reefer/database/condition-reefer.repository.port';
import { ConditionReeferEntity } from '@modules/condition-reefer/domain/condition-reefer.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateConditionReeferCommand } from './create-condition-reefer.command';
import { ConditionReeferCodeAlreadyExistsError } from '../../domain/condition-reefer.error';
import { ConflictException } from '@src/libs/exceptions';

export type CreateConditionReeferServiceResult = Result<
  ConditionReeferEntity,
  ConditionReeferCodeAlreadyExistsError
>;

@CommandHandler(CreateConditionReeferCommand)
export class CreateConditionReeferService implements ICommandHandler {
  constructor(
    @Inject(CONDITION_REEFER_REPOSITORY)
    protected readonly conditionReeferRepo: ConditionReeferRepositoryPort,
  ) {}

  async execute(
    command: CreateConditionReeferCommand,
  ): Promise<CreateConditionReeferServiceResult> {
    const conditionReefer = ConditionReeferEntity.create({
      ...command.getExtendedProps<CreateConditionReeferCommand>(),
    });

    try {
      const createdConditionReefer = await this.conditionReeferRepo.insert(
        conditionReefer,
      );
      return Ok(createdConditionReefer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ConditionReeferCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
