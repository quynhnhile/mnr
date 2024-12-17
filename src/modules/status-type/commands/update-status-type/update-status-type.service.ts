import { Err, Ok, Result } from 'oxide.ts';
import { STATUS_TYPE_REPOSITORY } from '@modules/status-type/status-type.di-tokens';
import { StatusTypeRepositoryPort } from '@modules/status-type/database/status-type.repository.port';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import {
  StatusTypeCodeAlreadyExsitError,
  StatusTypeCodeAlreadyInUseError,
  StatusTypeNotFoundError,
} from '@modules/status-type/domain/status-type.error';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusTypeCommand } from './update-status-type.command';

export type UpdateStatusTypeServiceResult = Result<
  StatusTypeEntity,
  | StatusTypeNotFoundError
  | StatusTypeCodeAlreadyExsitError
  | StatusTypeCodeAlreadyInUseError
>;

@CommandHandler(UpdateStatusTypeCommand)
export class UpdateStatusTypeService implements ICommandHandler {
  constructor(
    @Inject(STATUS_TYPE_REPOSITORY)
    protected readonly statusTypeRepo: StatusTypeRepositoryPort,
  ) {}

  async execute(
    command: UpdateStatusTypeCommand,
  ): Promise<UpdateStatusTypeServiceResult> {
    const found = await this.statusTypeRepo.findOneByIdWithInUseCount(
      command.statusTypeId,
    );
    if (found.isNone()) {
      return Err(new StatusTypeNotFoundError());
    }

    const statusType = found.unwrap();
    const updateResult = statusType.update({
      ...command.getExtendedProps<UpdateStatusTypeCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedStatusType = await this.statusTypeRepo.update(statusType);
      return Ok(updatedStatusType);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new StatusTypeCodeAlreadyExsitError());
      }
      throw error;
    }
  }
}
