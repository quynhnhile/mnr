import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateContainerHttpController } from './commands/create-container/create-container.http.controller';
import { CreateContainerService } from './commands/create-container/create-container.service';
import { DeleteContainerHttpController } from './commands/delete-container/delete-container.http.controller';
import { DeleteContainerService } from './commands/delete-container/delete-container.service';
import { UpdateContainerHttpController } from './commands/update-container/update-container.http.controller';
import { UpdateContainerService } from './commands/update-container/update-container.service';
import { CONTAINER_REPOSITORY } from './container.di-tokens';
import { PrismaContainerRepository } from './database/container.repository.prisma';
import { ContainerMapper } from './mappers/container.mapper';
import { FindContainerByContainerNoHttpController } from './queries/find-container-by-container-no/find-container-by-container-no.http.controller';
import { FindRepairContByContainerNoQueryHandler } from './queries/find-container-by-container-no/find-container-by-container-no.query-handler';
import { FindContainerHttpController } from './queries/find-container/find-container.http.controller';
import { FindContainerQueryHandler } from './queries/find-container/find-container.query-handler';
import { FindContainersHttpController } from './queries/find-containers/find-containers.http.controller';
import { FindContainersQueryHandler } from './queries/find-containers/find-containers.query-handler';
import { Validation } from '@src/libs/utils/validation';

const httpControllers = [
  CreateContainerHttpController,
  FindContainersHttpController,
  FindContainerByContainerNoHttpController,
  FindContainerHttpController,
  UpdateContainerHttpController,
  DeleteContainerHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateContainerService,
  UpdateContainerService,
  DeleteContainerService,
];

const queryHandlers: Provider[] = [
  FindContainersQueryHandler,
  FindRepairContByContainerNoQueryHandler,
  FindContainerQueryHandler,
];

const mappers: Provider[] = [ContainerMapper];

const utils: Provider[] = [Validation];

const repositories: Provider[] = [
  {
    provide: CONTAINER_REPOSITORY,
    useClass: PrismaContainerRepository,
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
    ...utils,
  ],
  exports: [...repositories, ...mappers],
})
export class ContainerModule {}
