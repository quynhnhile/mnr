import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GROUP_LOCATION_LOCAL_REPOSITORY } from './group-location-local.di-tokens';
import { CreateGroupLocationLocalHttpController } from './commands/create-group-location-local/create-group-location-local.http.controller';
import { CreateGroupLocationLocalService } from './commands/create-group-location-local/create-group-location-local.service';
import { DeleteGroupLocationLocalHttpController } from './commands/delete-group-location-local/delete-group-location-local.http.controller';
import { DeleteGroupLocationLocalService } from './commands/delete-group-location-local/delete-group-location-local.service';
import { UpdateGroupLocationLocalHttpController } from './commands/update-group-location-local/update-group-location-local.http.controller';
import { UpdateGroupLocationLocalService } from './commands/update-group-location-local/update-group-location-local.service';
import { PrismaGroupLocationLocalRepository } from './database/group-location-local.repository.prisma';
import { GroupLocationLocalMapper } from './mappers/group-location-local.mapper';
import { FindGroupLocationLocalHttpController } from './queries/find-group-location-local/find-group-location-local.http.controller';
import { FindGroupLocationLocalQueryHandler } from './queries/find-group-location-local/find-group-location-local.query-handler';
import { FindGroupLocationLocalsHttpController } from './queries/find-group-location-locals/find-group-location-locals.http.controller';
import { FindGroupLocationLocalsQueryHandler } from './queries/find-group-location-locals/find-group-location-locals.query-handler';

const httpControllers = [
  CreateGroupLocationLocalHttpController,
  FindGroupLocationLocalsHttpController,
  FindGroupLocationLocalHttpController,
  UpdateGroupLocationLocalHttpController,
  DeleteGroupLocationLocalHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateGroupLocationLocalService,
  UpdateGroupLocationLocalService,
  DeleteGroupLocationLocalService,
];

const queryHandlers: Provider[] = [
  FindGroupLocationLocalsQueryHandler,
  FindGroupLocationLocalQueryHandler,
];

const mappers: Provider[] = [GroupLocationLocalMapper];

const repositories: Provider[] = [
  {
    provide: GROUP_LOCATION_LOCAL_REPOSITORY,
    useClass: PrismaGroupLocationLocalRepository,
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
export class GroupLocationLocalModule {}
