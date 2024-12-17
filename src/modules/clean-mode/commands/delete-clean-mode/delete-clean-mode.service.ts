import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import {
  CleanModeCodeAlreadyInUseError,
  CleanModeNotFoundError,
} from '@modules/clean-mode/domain/clean-mode.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCleanModeCommand } from './delete-clean-mode.command';

export type DeleteCleanModeServiceResult = Result<
  boolean,
  CleanModeNotFoundError | CleanModeCodeAlreadyInUseError
>;

@CommandHandler(DeleteCleanModeCommand)
export class DeleteCleanModeService implements ICommandHandler {
  constructor(
    @Inject(CLEAN_MODE_REPOSITORY)
    protected readonly cleanModeRepo: CleanModeRepositoryPort,
  ) {}

  async execute(
    command: DeleteCleanModeCommand,
  ): Promise<DeleteCleanModeServiceResult> {
    const found = await this.cleanModeRepo.findOneByIdWithInUseCount(
      command.cleanModeId,
    );
    if (found.isNone()) {
      return Err(new CleanModeNotFoundError());
    }

    const cleanMode = found.unwrap();
    const deleteResult = cleanMode.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.cleanModeRepo.delete(cleanMode);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new CleanModeNotFoundError(error));
      }

      throw error;
    }
  }
}
