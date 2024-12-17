import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOperationHttpController } from './commands/create-operation/create-operation.http.controller';
import { CreateOperationService } from './commands/create-operation/create-operation.service';
import { DeleteOperationHttpController } from './commands/delete-operation/delete-operation.http.controller';
import { DeleteOperationService } from './commands/delete-operation/delete-operation.service';
import { UpdateOperationHttpController } from './commands/update-operation/update-operation.http.controller';
import { UpdateOperationService } from './commands/update-operation/update-operation.service';
import { PrismaOperationRepository } from './database/operation.repository.prisma';
import { OperationMapper } from './mappers/operation.mapper';
import { OPERATION_REPOSITORY } from './operation.di-tokens';
import { FindOperationHttpController } from './queries/find-operation/find-operation.http.controller';
import { FindOperationQueryHandler } from './queries/find-operation/find-operation.query-handler';
import { FindOperationsHttpController } from './queries/find-operations/find-operations.http.controller';
import { FindOperationsQueryHandler } from './queries/find-operations/find-operations.query-handler';

const httpControllers = [
  CreateOperationHttpController,
  FindOperationsHttpController,
  FindOperationHttpController,
  UpdateOperationHttpController,
  DeleteOperationHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateOperationService,
  UpdateOperationService,
  DeleteOperationService,
];

const queryHandlers: Provider[] = [
  FindOperationsQueryHandler,
  FindOperationQueryHandler,
];

const mappers: Provider[] = [OperationMapper];

const repositories: Provider[] = [
  {
    provide: OPERATION_REPOSITORY,
    useClass: PrismaOperationRepository,
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
export class OperationModule {}
