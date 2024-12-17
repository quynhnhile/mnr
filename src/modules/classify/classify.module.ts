import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CLASSIFY_REPOSITORY } from './classify.di-tokens';
import { CreateClassifyHttpController } from './commands/create-classify/create-classify.http.controller';
import { CreateClassifyService } from './commands/create-classify/create-classify.service';
import { DeleteClassifyHttpController } from './commands/delete-classify/delete-classify.http.controller';
import { DeleteClassifyService } from './commands/delete-classify/delete-classify.service';
import { UpdateClassifyHttpController } from './commands/update-classify/update-classify.http.controller';
import { UpdateClassifyService } from './commands/update-classify/update-classify.service';
import { PrismaClassifyRepository } from './database/classify.repository.prisma';
import { ClassifyMapper } from './mappers/classify.mapper';
import { FindClassifiesHttpController } from './queries/find-classifies/find-classifies.http.controller';
import { FindClassifiesQueryHandler } from './queries/find-classifies/find-classifies.query-handler';
import { FindClassifyHttpController } from './queries/find-classify/find-classify.http.controller';
import { FindClassifyQueryHandler } from './queries/find-classify/find-classify.query-handler';

const httpControllers = [
  CreateClassifyHttpController,
  FindClassifiesHttpController,
  FindClassifyHttpController,
  UpdateClassifyHttpController,
  DeleteClassifyHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateClassifyService,
  UpdateClassifyService,
  DeleteClassifyService,
];

const queryHandlers: Provider[] = [
  FindClassifiesQueryHandler,
  FindClassifyQueryHandler,
];

const mappers: Provider[] = [ClassifyMapper];

const repositories: Provider[] = [
  {
    provide: CLASSIFY_REPOSITORY,
    useClass: PrismaClassifyRepository,
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
export class ClassifyModule {}
