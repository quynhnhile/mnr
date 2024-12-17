import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import { OperationCodeAlreadyExistsError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOperationCommand } from './create-operation.command';

export type CreateOperationServiceResult = Result<
  OperationEntity,
  OperationCodeAlreadyExistsError
>;

@CommandHandler(CreateOperationCommand)
export class CreateOperationService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    protected readonly operationRepo: OperationRepositoryPort,
  ) {}

  async execute(
    command: CreateOperationCommand,
  ): Promise<CreateOperationServiceResult> {
    const operation = OperationEntity.create({
      ...command.getExtendedProps<CreateOperationCommand>(),
    });

    try {
      const createdOperation = await this.operationRepo.insert(operation);
      return Ok(createdOperation);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OperationCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
