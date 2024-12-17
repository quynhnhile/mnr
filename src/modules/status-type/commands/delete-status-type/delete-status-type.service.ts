import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { STATUS_TYPE_REPOSITORY } from '@modules/status-type/status-type.di-tokens';
import { StatusTypeRepositoryPort } from '@modules/status-type/database/status-type.repository.port';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import {
  StatusTypeCodeAlreadyInUseError,
  StatusTypeNotFoundError,
} from '@modules/status-type/domain/status-type.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteStatusTypeCommand } from './delete-status-type.command';

export type DeleteStatusTypeServiceResult = Result<
  boolean,
  StatusTypeNotFoundError | StatusTypeCodeAlreadyInUseError
>;

@CommandHandler(DeleteStatusTypeCommand)
export class DeleteStatusTypeService implements ICommandHandler {
  constructor(
    @Inject(STATUS_TYPE_REPOSITORY)
    protected readonly statusTypeRepo: StatusTypeRepositoryPort,
  ) {}

  async execute(
    command: DeleteStatusTypeCommand,
  ): Promise<DeleteStatusTypeServiceResult> {
    const found = await this.statusTypeRepo.findOneByIdWithInUseCount(
      command.statusTypeId,
    );
    if (found.isNone()) {
      return Err(new StatusTypeNotFoundError());
    }

    const statusType = found.unwrap();
    const deleteResult = statusType.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.statusTypeRepo.delete({
        id: command.statusTypeId,
      } as StatusTypeEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new StatusTypeNotFoundError(error));
      }

      throw error;
    }
  }
}
