import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserQueueProcessorService } from './application/queue-handlers/user-queue-processor.service';
import { AddQueueUserHttpController } from './commands/add-queue/add-queue.http-controller';
import { AddQueueUserService } from './commands/add-queue/add-queue.service';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
// import { PrismaUserRepository } from './database/user.repository.prisma';
// import { PrismaUserMapper } from './prisma-user.mapper';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';
import { FindUsersQueryHandler } from './queries/find-users/find-users.query-handler';

const httpControllers = [
  CreateUserHttpController,
  DeleteUserHttpController,
  FindUsersHttpController,
  AddQueueUserHttpController,
];

const commandHandlers: Provider[] = [
  CreateUserService,
  DeleteUserService,
  AddQueueUserService,
];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const eventHandlers: Provider[] = [];

const queueHandlers: Provider[] = [UserQueueProcessorService];

const mappers: Provider[] = [];

const repositories: Provider[] = [
  // { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...queueHandlers,
    ...mappers,
  ],
})
export class UserModule {}
