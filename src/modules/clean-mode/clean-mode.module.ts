import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CLEAN_MODE_REPOSITORY } from './clean-mode.di-tokens';
import { CreateCleanModeHttpController } from './commands/create-clean-mode/create-clean-mode.http.controller';
import { CreateCleanModeService } from './commands/create-clean-mode/create-clean-mode.service';
import { DeleteCleanModeHttpController } from './commands/delete-clean-mode/delete-clean-mode.http.controller';
import { DeleteCleanModeService } from './commands/delete-clean-mode/delete-clean-mode.service';
import { UpdateCleanModeHttpController } from './commands/update-clean-mode/update-clean-mode.http.controller';
import { UpdateCleanModeService } from './commands/update-clean-mode/update-clean-mode.service';
import { PrismaCleanModeRepository } from './database/clean-mode.repository.prisma';
import { CleanModeMapper } from './mappers/clean-mode.mapper';
import { FindCleanModeHttpController } from './queries/find-clean-mode/find-clean-mode.http.controller';
import { FindCleanModeQueryHandler } from './queries/find-clean-mode/find-clean-mode.query-handler';
import { FindCleanModesHttpController } from './queries/find-clean-modes/find-clean-modes.http.controller';
import { FindCleanModesQueryHandler } from './queries/find-clean-modes/find-clean-modes.query-handler';

const httpControllers = [
  CreateCleanModeHttpController,
  FindCleanModesHttpController,
  FindCleanModeHttpController,
  UpdateCleanModeHttpController,
  DeleteCleanModeHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateCleanModeService,
  UpdateCleanModeService,
  DeleteCleanModeService,
];

const queryHandlers: Provider[] = [
  FindCleanModesQueryHandler,
  FindCleanModeQueryHandler,
];

const mappers: Provider[] = [CleanModeMapper];

const repositories: Provider[] = [
  {
    provide: CLEAN_MODE_REPOSITORY,
    useClass: PrismaCleanModeRepository,
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
export class CleanModeModule {}
