import { Err, Ok, Result } from 'oxide.ts';
import { STATUS_TYPE_REPOSITORY } from '@modules/status-type/status-type.di-tokens';
import { StatusTypeRepositoryPort } from '@modules/status-type/database/status-type.repository.port';
import { StatusTypeEntity } from '@modules/status-type/domain/status-type.entity';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateStatusTypeCommand } from './create-status-type.command';
import { StatusTypeCodeAlreadyExsitError } from '../../domain/status-type.error';

export type CreateStatusTypeServiceResult = Result<
  StatusTypeEntity,
  StatusTypeCodeAlreadyExsitError
>;

@CommandHandler(CreateStatusTypeCommand)
export class CreateStatusTypeService implements ICommandHandler {
  constructor(
    @Inject(STATUS_TYPE_REPOSITORY)
    protected readonly statusTypeRepo: StatusTypeRepositoryPort,
  ) {}

  async execute(
    command: CreateStatusTypeCommand,
  ): Promise<CreateStatusTypeServiceResult> {
    const statusType = StatusTypeEntity.create({
      ...command.getExtendedProps<CreateStatusTypeCommand>(),
    });

    try {
      const createdStatusType = await this.statusTypeRepo.insert(statusType);
      return Ok(createdStatusType);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new StatusTypeCodeAlreadyExsitError(error));
      }
      throw error;
    }
  }
}
