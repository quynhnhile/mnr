import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinishJobRepairCleanCommand } from './finish-job-repair-clean.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../../job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '../../database/job-repair-clean.repository.port';
import {
  JobRepairCleanAlreadyFinishedError,
  JobRepairCleanNotFoundError,
} from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';

export type FinishJobRepairCleanServiceResult = Result<
  JobRepairCleanEntity,
  JobRepairCleanNotFoundError | JobRepairCleanAlreadyFinishedError
>;

@CommandHandler(FinishJobRepairCleanCommand)
export class FinishJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: FinishJobRepairCleanCommand,
  ): Promise<FinishJobRepairCleanServiceResult> {
    const found = await this.jobRepairCleanRepo.findOneById(
      command.jobRepairCleanId,
    );
    if (found.isNone()) {
      return Err(new JobRepairCleanNotFoundError());
    }

    const props = command.getExtendedProps<FinishJobRepairCleanCommand>();
    const jobRepairClean = found.unwrap();
    const finishResult = jobRepairClean.finish(props);
    if (finishResult.isErr()) {
      return finishResult;
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
