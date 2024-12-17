import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CLEAN_METHOD_REPOSITORY } from './clean-method.di-tokens';
import { CreateCleanMethodHttpController } from './commands/create-clean-method/create-clean-method.http.controller';
import { CreateCleanMethodService } from './commands/create-clean-method/create-clean-method.service';
import { DeleteCleanMethodHttpController } from './commands/delete-clean-method/delete-clean-method.http.controller';
import { DeleteCleanMethodService } from './commands/delete-clean-method/delete-clean-method.service';
import { UpdateCleanMethodHttpController } from './commands/update-clean-method/update-clean-method.http.controller';
import { UpdateCleanMethodService } from './commands/update-clean-method/update-clean-method.service';
import { PrismaCleanMethodRepository } from './database/clean-method.repository.prisma';
import { CleanMethodMapper } from './mappers/clean-method.mapper';
import { FindCleanMethodHttpController } from './queries/find-clean-method/find-clean-method.http.controller';
import { FindCleanMethodQueryHandler } from './queries/find-clean-method/find-clean-method.query-handler';
import { FindCleanMethodsHttpController } from './queries/find-clean-methods/find-clean-methods.http.controller';
import { FindCleanMethodsQueryHandler } from './queries/find-clean-methods/find-clean-methods.query-handler';

const httpControllers = [
  CreateCleanMethodHttpController,
  FindCleanMethodsHttpController,
  FindCleanMethodHttpController,
  UpdateCleanMethodHttpController,
  DeleteCleanMethodHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateCleanMethodService,
  UpdateCleanMethodService,
  DeleteCleanMethodService,
];

const queryHandlers: Provider[] = [
  FindCleanMethodsQueryHandler,
  FindCleanMethodQueryHandler,
];

const mappers: Provider[] = [CleanMethodMapper];

const repositories: Provider[] = [
  {
    provide: CLEAN_METHOD_REPOSITORY,
    useClass: PrismaCleanMethodRepository,
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
  exports: [...repositories],
})
export class CleanMethodModule {}
