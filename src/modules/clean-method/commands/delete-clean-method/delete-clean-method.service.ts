import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import {
  CleanMethodCodeAlreadyInUseError,
  CleanMethodNotFoundError,
} from '@modules/clean-method/domain/clean-method.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCleanMethodCommand } from './delete-clean-method.command';

export type DeleteCleanMethodServiceResult = Result<
  boolean,
  CleanMethodNotFoundError | CleanMethodCodeAlreadyInUseError
>;

@CommandHandler(DeleteCleanMethodCommand)
export class DeleteCleanMethodService implements ICommandHandler {
  constructor(
    @Inject(CLEAN_METHOD_REPOSITORY)
    protected readonly cleanMethodRepo: CleanMethodRepositoryPort,
  ) {}

  async execute(
    command: DeleteCleanMethodCommand,
  ): Promise<DeleteCleanMethodServiceResult> {
    const found = await this.cleanMethodRepo.findOneByIdWithInUseCount(
      command.cleanMethodId,
    );
    if (found.isNone()) {
      return Err(new CleanMethodNotFoundError());
    }

    const cleanMethod = found.unwrap();
    const deleteResult = cleanMethod.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.cleanMethodRepo.delete(cleanMethod);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new CleanMethodNotFoundError(error));
      }

      throw error;
    }
  }
}
