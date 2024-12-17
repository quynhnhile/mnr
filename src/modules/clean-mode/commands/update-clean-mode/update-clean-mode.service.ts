import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import {
  CleanModeCodeAlreadyInUseError,
  CleanModeCodeAndOperationCodeAlreadyExistError,
  CleanModeNotFoundError,
} from '@modules/clean-mode/domain/clean-mode.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCleanModeCommand } from './update-clean-mode.command';
import { ConflictException } from '@src/libs/exceptions';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

export type UpdateCleanModeServiceResult = Result<
  CleanModeEntity,
  | CleanModeNotFoundError
  | OperationNotFoundError
  | CleanModeCodeAlreadyInUseError
  | CleanModeCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(UpdateCleanModeCommand)
export class UpdateCleanModeService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CLEAN_MODE_REPOSITORY)
    protected readonly cleanModeRepo: CleanModeRepositoryPort,
  ) {}

  async execute(
    command: UpdateCleanModeCommand,
  ): Promise<UpdateCleanModeServiceResult> {
    const found = await this.cleanModeRepo.findOneById(command.cleanModeId);
    if (found.isNone()) {
      return Err(new CleanModeNotFoundError());
    }

    const props = command.getExtendedProps<UpdateCleanModeCommand>();

    const cleanMode = found.unwrap();
    const updateResult = cleanMode.update(props);
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedCleanMode = await this.cleanModeRepo.update(cleanMode);
      return Ok(updatedCleanMode);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CleanModeCodeAndOperationCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
