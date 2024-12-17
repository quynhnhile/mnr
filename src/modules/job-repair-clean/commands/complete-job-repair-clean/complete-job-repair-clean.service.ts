import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteJobRepairCleanCommand } from './complete-job-repair-clean.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../../job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '../../database/job-repair-clean.repository.port';
import {
  JobRepairCleanAlreadyCompletedError,
  JobRepairCleanNotFoundError,
} from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';

export type CompleteJobRepairCleanServiceResult = Result<
  JobRepairCleanEntity,
  JobRepairCleanNotFoundError | JobRepairCleanAlreadyCompletedError
>;

@CommandHandler(CompleteJobRepairCleanCommand)
export class CompleteJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: CompleteJobRepairCleanCommand,
  ): Promise<CompleteJobRepairCleanServiceResult> {
    const found = await this.jobRepairCleanRepo.findOneById(
      command.jobRepairCleanId,
    );
    if (found.isNone()) {
      return Err(new JobRepairCleanNotFoundError());
    }

    const props = command.getExtendedProps<CompleteJobRepairCleanCommand>();
    const jobRepairClean = found.unwrap();
    const completeResult = jobRepairClean.complete(props);
    if (completeResult.isErr()) {
      return completeResult;
    }

    try {
      const updatedJobRepairClean = await this.jobRepairCleanRepo.update(
        jobRepairClean,
      );
      return Ok(updatedJobRepairClean);
    } catch (error: any) {
      throw error;
    }
  }
}
