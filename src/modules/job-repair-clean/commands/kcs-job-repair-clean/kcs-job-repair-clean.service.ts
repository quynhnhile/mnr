import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KcsJobRepairCleanCommand } from './kcs-job-repair-clean.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../../job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '../../database/job-repair-clean.repository.port';
import { JobRepairCleanNotFoundError } from '../../domain/job-repair-clean.error';
import { JobRepairCleanEntity } from '../../domain/job-repair-clean.entity';

export type KcsJobRepairCleanServiceResult = Result<
  JobRepairCleanEntity,
  JobRepairCleanNotFoundError
>;

@CommandHandler(KcsJobRepairCleanCommand)
export class KcsJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: KcsJobRepairCleanCommand,
  ): Promise<KcsJobRepairCleanServiceResult> {
    const found = await this.jobRepairCleanRepo.findOneById(
      command.jobRepairCleanId,
    );
    if (found.isNone()) {
      return Err(new JobRepairCleanNotFoundError());
    }

    const props = command.getExtendedProps<KcsJobRepairCleanCommand>();

    const jobRepairClean = found.unwrap();
    jobRepairClean.update(props);

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
