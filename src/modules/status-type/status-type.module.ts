import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { STATUS_TYPE_REPOSITORY } from './status-type.di-tokens';
import { CreateStatusTypeHttpController } from './commands/create-status-type/create-status-type.http.controller';
import { CreateStatusTypeService } from './commands/create-status-type/create-status-type.service';
import { DeleteStatusTypeHttpController } from './commands/delete-status-type/delete-status-type.http.controller';
import { DeleteStatusTypeService } from './commands/delete-status-type/delete-status-type.service';
import { UpdateStatusTypeHttpController } from './commands/update-status-type/update-status-type.http.controller';
import { UpdateStatusTypeService } from './commands/update-status-type/update-status-type.service';
import { PrismaStatusTypeRepository } from './database/status-type.repository.prisma';
import { StatusTypeMapper } from './mappers/status-type.mapper';
import { FindStatusTypeHttpController } from './queries/find-status-type/find-status-type.http.controller';
import { FindStatusTypeQueryHandler } from './queries/find-status-type/find-status-type.query-handler';
import { FindStatusTypesHttpController } from './queries/find-status-types/find-status-types.http.controller';
import { FindStatusTypesQueryHandler } from './queries/find-status-types/find-status-types.query-handler';

const httpControllers = [
  CreateStatusTypeHttpController,
  FindStatusTypesHttpController,
  FindStatusTypeHttpController,
  UpdateStatusTypeHttpController,
  DeleteStatusTypeHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateStatusTypeService,
  UpdateStatusTypeService,
  DeleteStatusTypeService,
];

const queryHandlers: Provider[] = [
  FindStatusTypesQueryHandler,
  FindStatusTypeQueryHandler,
];

const mappers: Provider[] = [StatusTypeMapper];

const repositories: Provider[] = [
  {
    provide: STATUS_TYPE_REPOSITORY,
    useClass: PrismaStatusTypeRepository,
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
export class StatusTypeModule {}
