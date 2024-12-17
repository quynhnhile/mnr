import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LOCATION_LOCAL_REPOSITORY } from './location-local.di-tokens';
import { CreateLocationLocalHttpController } from './commands/create-location-local/create-location-local.http.controller';
import { CreateLocationLocalService } from './commands/create-location-local/create-location-local.service';
import { DeleteLocationLocalHttpController } from './commands/delete-location-local/delete-location-local.http.controller';
import { DeleteLocationLocalService } from './commands/delete-location-local/delete-location-local.service';
import { UpdateLocationLocalHttpController } from './commands/update-location-local/update-location-local.http.controller';
import { UpdateLocationLocalService } from './commands/update-location-local/update-location-local.service';
import { PrismaLocationLocalRepository } from './database/location-local.repository.prisma';
import { LocationLocalMapper } from './mappers/location-local.mapper';
import { FindLocationLocalHttpController } from './queries/find-location-local/find-location-local.http.controller';
import { FindLocationLocalQueryHandler } from './queries/find-location-local/find-location-local.query-handler';
import { FindLocationLocalsHttpController } from './queries/find-location-locals/find-location-locals.http.controller';
import { FindLocationLocalsQueryHandler } from './queries/find-location-locals/find-location-locals.query-handler';

const httpControllers = [
  CreateLocationLocalHttpController,
  FindLocationLocalsHttpController,
  FindLocationLocalHttpController,
  UpdateLocationLocalHttpController,
  DeleteLocationLocalHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateLocationLocalService,
  UpdateLocationLocalService,
  DeleteLocationLocalService,
];

const queryHandlers: Provider[] = [
  FindLocationLocalsQueryHandler,
  FindLocationLocalQueryHandler,
];

const mappers: Provider[] = [LocationLocalMapper];

const repositories: Provider[] = [
  {
    provide: LOCATION_LOCAL_REPOSITORY,
    useClass: PrismaLocationLocalRepository,
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
export class LocationLocalModule {}
