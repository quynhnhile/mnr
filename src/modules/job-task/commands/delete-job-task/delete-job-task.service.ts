import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { JOB_TASK_REPOSITORY } from '@modules/job-task/job-task.di-tokens';
import { JobTaskRepositoryPort } from '@modules/job-task/database/job-task.repository.port';
import { JobTaskEntity } from '@modules/job-task/domain/job-task.entity';
import {
  JobTaskCodeAlreadyInUseError,
  JobTaskNotFoundError,
} from '@modules/job-task/domain/job-task.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteJobTaskCommand } from './delete-job-task.command';

export type DeleteJobTaskServiceResult = Result<
  boolean,
  JobTaskNotFoundError | JobTaskCodeAlreadyInUseError
>;

@CommandHandler(DeleteJobTaskCommand)
export class DeleteJobTaskService implements ICommandHandler {
  constructor(
    @Inject(JOB_TASK_REPOSITORY)
    protected readonly jobTaskRepo: JobTaskRepositoryPort,
  ) {}

  async execute(
    command: DeleteJobTaskCommand,
  ): Promise<DeleteJobTaskServiceResult> {
    const found = await this.jobTaskRepo.findOneByIdWithInUseCount(
      command.jobTaskId,
    );
    if (found.isNone()) {
      return Err(new JobTaskNotFoundError());
    }

    const jobTask = found.unwrap();
    const deleteResult = jobTask.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.jobTaskRepo.delete({
        id: command.jobTaskId,
      } as JobTaskEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new JobTaskNotFoundError(error));
      }

      throw error;
    }
  }
}
