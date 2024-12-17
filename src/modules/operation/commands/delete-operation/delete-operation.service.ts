import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import {
  OperationCodeAlreadyInUseError,
  OperationNotFoundError,
} from '@modules/operation/domain/operation.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOperationCommand } from './delete-operation.command';

export type DeleteOperationServiceResult = Result<
  boolean,
  OperationNotFoundError | OperationCodeAlreadyInUseError
>;

@CommandHandler(DeleteOperationCommand)
export class DeleteOperationService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    protected readonly operationRepo: OperationRepositoryPort,
  ) {}

  async execute(
    command: DeleteOperationCommand,
  ): Promise<DeleteOperationServiceResult> {
    const found = await this.operationRepo.findOneByIdWithInUseCount(
      command.operationId,
    );
    if (found.isNone()) {
      return Err(new OperationNotFoundError());
    }

    const operation = found.unwrap();
    const deleteResult = operation.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.operationRepo.delete(operation);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new OperationNotFoundError(error));
      }

      throw error;
    }
  }
}
