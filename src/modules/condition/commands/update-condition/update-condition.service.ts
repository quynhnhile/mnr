import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import {
  ConditionCodeAlreadyExistsError,
  ConditionCodeAlreadyInUseError,
  ConditionNotFoundError,
} from '@modules/condition/domain/condition.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateConditionCommand } from './update-condition.command';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateConditionServiceResult = Result<
  ConditionEntity,
  | ConditionNotFoundError
  | OperationNotFoundError
  | ConditionCodeAlreadyInUseError
  | ConditionCodeAlreadyExistsError
>;

@CommandHandler(UpdateConditionCommand)
export class UpdateConditionService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CONDITION_REPOSITORY)
    protected readonly conditionRepo: ConditionRepositoryPort,
  ) {}

  async execute(
    command: UpdateConditionCommand,
  ): Promise<UpdateConditionServiceResult> {
    const props = command.getExtendedProps<UpdateConditionCommand>();

    const { operationCode } = props;

    const [foundOperationCode] = await Promise.all([
      operationCode
        ? this.operationRepo.findOneByCode(operationCode)
        : Promise.resolve(null),
    ]);

    if (operationCode && operationCode != '*' && foundOperationCode?.isNone()) {
      return Err(new OperationNotFoundError());
    }

    const found = await this.conditionRepo.findOneByIdWithInUseCount(
      command.conditionId,
    );
    if (found.isNone()) {
      return Err(new ConditionNotFoundError());
    }

    const condition = found.unwrap();
    condition.update(props);

    try {
      const updatedCondition = await this.conditionRepo.update(condition);
      return Ok(updatedCondition);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ConditionCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
