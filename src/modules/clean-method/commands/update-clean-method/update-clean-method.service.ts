import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import {
  CleanMethodCodeAlreadyInUseError,
  CleanMethodCodeAndOperationCodeAlreadyExistError,
  CleanMethodNotFoundError,
} from '@modules/clean-method/domain/clean-method.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCleanMethodCommand } from './update-clean-method.command';
import { ConflictException } from '@src/libs/exceptions';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

export type UpdateCleanMethodServiceResult = Result<
  CleanMethodEntity,
  | CleanMethodNotFoundError
  | OperationNotFoundError
  | CleanMethodCodeAlreadyInUseError
  | CleanMethodCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(UpdateCleanMethodCommand)
export class UpdateCleanMethodService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CLEAN_METHOD_REPOSITORY)
    protected readonly cleanMethodRepo: CleanMethodRepositoryPort,
  ) {}

  async execute(
    command: UpdateCleanMethodCommand,
  ): Promise<UpdateCleanMethodServiceResult> {
    const found = await this.cleanMethodRepo.findOneById(command.cleanMethodId);
    if (found.isNone()) {
      return Err(new CleanMethodNotFoundError());
    }

    const props = command.getExtendedProps<UpdateCleanMethodCommand>();

    const cleanMethod = found.unwrap();
    const updateResult = cleanMethod.update(props);
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedCleanMethod = await this.cleanMethodRepo.update(cleanMethod);
      return Ok(updatedCleanMethod);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CleanMethodCodeAndOperationCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
