import { Err, Ok, Result } from 'oxide.ts';
import { JOB_TASK_REPOSITORY } from '@modules/job-task/job-task.di-tokens';
import { JobTaskRepositoryPort } from '@modules/job-task/database/job-task.repository.port';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import {
  JobTaskCodeAlreadyExistsError,
  JobTaskCodeAlreadyInUseError,
  JobTaskNotFoundError,
} from '@modules/job-task/domain/job-task.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobTaskCommand } from './update-job-task.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateJobTaskServiceResult = Result<
  JobTaskEntity,
  | JobTaskNotFoundError
  | JobTaskCodeAlreadyExistsError
  | JobTaskCodeAlreadyInUseError
>;

@CommandHandler(UpdateJobTaskCommand)
export class UpdateJobTaskService implements ICommandHandler {
  constructor(
    @Inject(JOB_TASK_REPOSITORY)
    protected readonly jobTaskRepo: JobTaskRepositoryPort,
  ) {}

  async execute(
    command: UpdateJobTaskCommand,
  ): Promise<UpdateJobTaskServiceResult> {
    const found = await this.jobTaskRepo.findOneById(command.jobTaskId);
    if (found.isNone()) {
      return Err(new JobTaskNotFoundError());
    }

    const jobTask = found.unwrap();
    jobTask.update({
      ...command.getExtendedProps<UpdateJobTaskCommand>(),
    });

    try {
      const updatedJobTask = await this.jobTaskRepo.update(jobTask);
      return Ok(updatedJobTask);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new JobTaskCodeAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
