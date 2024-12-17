import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteJobRepairCleanCommand } from './delete-job-repair-clean.command';

export type DeleteJobRepairCleanServiceResult = Result<
  boolean,
  JobRepairCleanNotFoundError
>;

@CommandHandler(DeleteJobRepairCleanCommand)
export class DeleteJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: DeleteJobRepairCleanCommand,
  ): Promise<DeleteJobRepairCleanServiceResult> {
    try {
      const result = await this.jobRepairCleanRepo.delete({
        id: command.jobRepairCleanId,
      } as JobRepairCleanEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new JobRepairCleanNotFoundError(error));
      }

      throw error;
    }
  }
}
