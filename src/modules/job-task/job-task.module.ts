import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JOB_TASK_REPOSITORY } from './job-task.di-tokens';
import { CreateJobTaskHttpController } from './commands/create-job-task/create-job-task.http.controller';
import { CreateJobTaskService } from './commands/create-job-task/create-job-task.service';
import { DeleteJobTaskHttpController } from './commands/delete-job-task/delete-job-task.http.controller';
import { DeleteJobTaskService } from './commands/delete-job-task/delete-job-task.service';
import { UpdateJobTaskHttpController } from './commands/update-job-task/update-job-task.http.controller';
import { UpdateJobTaskService } from './commands/update-job-task/update-job-task.service';
import { PrismaJobTaskRepository } from './database/job-task.repository.prisma';
import { JobTaskMapper } from './mappers/job-task.mapper';
import { FindJobTaskHttpController } from './queries/find-job-task/find-job-task.http.controller';
import { FindJobTaskQueryHandler } from './queries/find-job-task/find-job-task.query-handler';
import { FindJobTasksHttpController } from './queries/find-job-tasks/find-job-tasks.http.controller';
import { FindJobTasksQueryHandler } from './queries/find-job-tasks/find-job-tasks.query-handler';

const httpControllers = [
  CreateJobTaskHttpController,
  FindJobTasksHttpController,
  FindJobTaskHttpController,
  UpdateJobTaskHttpController,
  DeleteJobTaskHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateJobTaskService,
  UpdateJobTaskService,
  DeleteJobTaskService,
];

const queryHandlers: Provider[] = [
  FindJobTasksQueryHandler,
  FindJobTaskQueryHandler,
];

const mappers: Provider[] = [JobTaskMapper];

const repositories: Provider[] = [
  {
    provide: JOB_TASK_REPOSITORY,
    useClass: PrismaJobTaskRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class JobTaskModule {}
