import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CreateContSizeMapHttpController } from './commands/create-cont-size-map/create-cont-size-map.http.controller';
import { CreateContSizeMapService } from './commands/create-cont-size-map/create-cont-size-map.service';
import { DeleteContSizeMapHttpController } from './commands/delete-cont-size-map/delete-cont-size-map.http.controller';
import { DeleteContSizeMapService } from './commands/delete-cont-size-map/delete-cont-size-map.service';
import { UpdateContSizeMapHttpController } from './commands/update-cont-size-map/update-cont-size-map.http.controller';
import { UpdateContSizeMapService } from './commands/update-cont-size-map/update-cont-size-map.service';
import { CONT_SIZE_MAP_REPOSITORY } from './cont-size-map.di-tokens';
import { PrismaContSizeMapRepository } from './database/cont-size-map.repository.prisma';
import { ContSizeMapMapper } from './mappers/cont-size-map.mapper';
import { FindContSizeMapHttpController } from './queries/find-cont-size-map/find-cont-size-map.http.controller';
import { FindContSizeMapQueryHandler } from './queries/find-cont-size-map/find-cont-size-map.query-handler';
import { FindContSizeMapsHttpController } from './queries/find-cont-size-maps/find-cont-size-maps.http.controller';
import { FindContSizeMapsQueryHandler } from './queries/find-cont-size-maps/find-cont-size-maps.query-handler';

const httpControllers = [
  CreateContSizeMapHttpController,
  FindContSizeMapsHttpController,
  FindContSizeMapHttpController,
  UpdateContSizeMapHttpController,
  DeleteContSizeMapHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateContSizeMapService,
  UpdateContSizeMapService,
  DeleteContSizeMapService,
];

const queryHandlers: Provider[] = [
  FindContSizeMapsQueryHandler,
  FindContSizeMapQueryHandler,
];

const mappers: Provider[] = [ContSizeMapMapper];

const repositories: Provider[] = [
  {
    provide: CONT_SIZE_MAP_REPOSITORY,
    useClass: PrismaContSizeMapRepository,
  },
];

@Module({
  imports: [CqrsModule, OperationModule],
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
export class ContSizeMapModule {}
