import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateComponentHttpController } from './commands/create-component/create-component.http.controller';
import { CreateComponentService } from './commands/create-component/create-component.service';
import { DeleteComponentHttpController } from './commands/delete-component/delete-component.http.controller';
import { DeleteComponentService } from './commands/delete-component/delete-component.service';
import { UpdateComponentHttpController } from './commands/update-component/update-component.http.controller';
import { UpdateComponentService } from './commands/update-component/update-component.service';
import { COMPONENT_REPOSITORY } from './component.di-tokens';
import { PrismaComponentRepository } from './database/component.repository.prisma';
import { ComponentMapper } from './mappers/component.mapper';
import { FindComponentHttpController } from './queries/find-component/find-component.http.controller';
import { FindComponentQueryHandler } from './queries/find-component/find-component.query-handler';
import { FindComponentsHttpController } from './queries/find-components/find-components.http.controller';
import { FindComponentsQueryHandler } from './queries/find-components/find-components.query-handler';

const httpControllers = [
  CreateComponentHttpController,
  FindComponentsHttpController,
  FindComponentHttpController,
  UpdateComponentHttpController,
  DeleteComponentHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateComponentService,
  UpdateComponentService,
  DeleteComponentService,
];

const queryHandlers: Provider[] = [
  FindComponentsQueryHandler,
  FindComponentQueryHandler,
];

const mappers: Provider[] = [ComponentMapper];

const repositories: Provider[] = [
  {
    provide: COMPONENT_REPOSITORY,
    useClass: PrismaComponentRepository,
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
export class ComponentModule {}
