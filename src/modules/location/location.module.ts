import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateLocationHttpController } from './commands/create-location/create-location.http.controller';
import { CreateLocationService } from './commands/create-location/create-location.service';
import { DeleteLocationHttpController } from './commands/delete-location/delete-location.http.controller';
import { DeleteLocationService } from './commands/delete-location/delete-location.service';
import { UpdateLocationHttpController } from './commands/update-location/update-location.http.controller';
import { UpdateLocationService } from './commands/update-location/update-location.service';
import { PrismaLocationRepository } from './database/location.repository.prisma';
import { LOCATION_REPOSITORY } from './location.di-tokens';
import { LocationMapper } from './mappers/location.mapper';
import { FindLocationHttpController } from './queries/find-location/find-location.http.controller';
import { FindLocationQueryHandler } from './queries/find-location/find-location.query-handler';
import { FindLocationsHttpController } from './queries/find-locations/find-locations.http.controller';
import { FindLocationsQueryHandler } from './queries/find-locations/find-locations.query-handler';

const httpControllers = [
  CreateLocationHttpController,
  FindLocationsHttpController,
  FindLocationHttpController,
  UpdateLocationHttpController,
  DeleteLocationHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateLocationService,
  UpdateLocationService,
  DeleteLocationService,
];

const queryHandlers: Provider[] = [
  FindLocationsQueryHandler,
  FindLocationQueryHandler,
];

const mappers: Provider[] = [LocationMapper];

const repositories: Provider[] = [
  {
    provide: LOCATION_REPOSITORY,
    useClass: PrismaLocationRepository,
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
  exports: [...repositories],
})
export class LocationModule {}
