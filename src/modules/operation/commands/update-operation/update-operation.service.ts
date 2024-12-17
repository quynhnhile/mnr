import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import {
  OperationCodeAlreadyExistsError,
  OperationCodeAlreadyInUseError,
  OperationNotFoundError,
} from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOperationCommand } from './update-operation.command';

export type UpdateOperationServiceResult = Result<
  OperationEntity,
  | OperationNotFoundError
  | OperationCodeAlreadyInUseError
  | OperationCodeAlreadyExistsError
>;

@CommandHandler(UpdateOperationCommand)
export class UpdateOperationService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    protected readonly operationRepo: OperationRepositoryPort,
  ) {}

  async execute(
    command: UpdateOperationCommand,
  ): Promise<UpdateOperationServiceResult> {
    const found = await this.operationRepo.findOneByIdWithInUseCount(
      command.operationId,
    );
    if (found.isNone()) {
      return Err(new OperationNotFoundError());
    }

    const operation = found.unwrap();
    const updatrResult = operation.update({
      ...command.getExtendedProps<UpdateOperationCommand>(),
    });
    if (updatrResult.isErr()) {
      return updatrResult;
    }

    try {
      const updatedOperation = await this.operationRepo.update(operation);
      return Ok(updatedOperation);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OperationCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
