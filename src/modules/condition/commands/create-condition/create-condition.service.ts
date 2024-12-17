import { Err, Ok, Result } from 'oxide.ts';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionEntity } from '@modules/condition/domain/condition.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateConditionCommand } from './create-condition.command';
import { ConflictException } from '@src/libs/exceptions';
import { ConditionCodeAlreadyExistsError } from '../../domain/condition.error';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

export type CreateConditionServiceResult = Result<
  ConditionEntity,
  OperationNotFoundError | ConditionCodeAlreadyExistsError
>;

@CommandHandler(CreateConditionCommand)
export class CreateConditionService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CONDITION_REPOSITORY)
    protected readonly conditionRepo: ConditionRepositoryPort,
  ) {}

  async execute(
    command: CreateConditionCommand,
  ): Promise<CreateConditionServiceResult> {
    const props = command.getExtendedProps<CreateConditionCommand>();

    const { operationCode } = props;

    const [foundOperationCode] = await Promise.all([
      this.operationRepo.findOneByCode(operationCode),
    ]);

    if (operationCode != '*' && foundOperationCode.isNone()) {
      return Err(new OperationNotFoundError());
    }

    const condition = ConditionEntity.create(props);

    try {
      const createdCondition = await this.conditionRepo.insert(condition);
      return Ok(createdCondition);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ConditionCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
