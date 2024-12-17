import { Err, Ok, Result } from 'oxide.ts';
import { JOB_TASK_REPOSITORY } from '@modules/job-task/job-task.di-tokens';
import { JobTaskRepositoryPort } from '@modules/job-task/database/job-task.repository.port';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateJobTaskCommand } from './create-job-task.command';
import { ConflictException } from '@src/libs/exceptions';
import { JobTaskCodeAlreadyExistsError } from '../../domain/job-task.error';

export type CreateJobTaskServiceResult = Result<
  JobTaskEntity,
  JobTaskCodeAlreadyExistsError
>;

@CommandHandler(CreateJobTaskCommand)
export class CreateJobTaskService implements ICommandHandler {
  constructor(
    @Inject(JOB_TASK_REPOSITORY)
    protected readonly jobTaskRepo: JobTaskRepositoryPort,
  ) {}

  async execute(
    command: CreateJobTaskCommand,
  ): Promise<CreateJobTaskServiceResult> {
    const jobTask = JobTaskEntity.create({
      ...command.getExtendedProps<CreateJobTaskCommand>(),
    });

    try {
      const createdJobTask = await this.jobTaskRepo.insert(jobTask);
      return Ok(createdJobTask);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new JobTaskCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
