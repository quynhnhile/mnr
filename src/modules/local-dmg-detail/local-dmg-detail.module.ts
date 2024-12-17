import { Logger, Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SurveyModule } from '../survey/survey.module';
import { CreateLocalDmgDetailHttpController } from './commands/create-local-dmg-detail/create-local-dmg-detail.http.controller';
import { CreateLocalDmgDetailService } from './commands/create-local-dmg-detail/create-local-dmg-detail.service';
import { DeleteLocalDmgDetailHttpController } from './commands/delete-local-dmg-detail/delete-local-dmg-detail.http.controller';
import { DeleteLocalDmgDetailService } from './commands/delete-local-dmg-detail/delete-local-dmg-detail.service';
import { UpdateLocalDmgDetailHttpController } from './commands/update-local-dmg-detail/update-local-dmg-detail.http.controller';
import { UpdateLocalDmgDetailService } from './commands/update-local-dmg-detail/update-local-dmg-detail.service';
import { PrismaLocalDmgDetailRepository } from './database/local-dmg-detail.repository.prisma';
import { LOCAL_DMG_DETAIL_REPOSITORY } from './local-dmg-detail.di-tokens';
import { LocalDmgDetailMapper } from './mappers/local-dmg-detail.mapper';
import { FindLocalDmgDetailHttpController } from './queries/find-local-dmg-detail/find-local-dmg-detail.http.controller';
import { FindLocalDmgDetailQueryHandler } from './queries/find-local-dmg-detail/find-local-dmg-detail.query-handler';
import { FindLocalDmgDetailsHttpController } from './queries/find-local-dmg-details/find-local-dmg-details.http.controller';
import { FindLocalDmgDetailsQueryHandler } from './queries/find-local-dmg-details/find-local-dmg-details.query-handler';

const httpControllers = [
  CreateLocalDmgDetailHttpController,
  FindLocalDmgDetailsHttpController,
  FindLocalDmgDetailHttpController,
  UpdateLocalDmgDetailHttpController,
  DeleteLocalDmgDetailHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateLocalDmgDetailService,
  UpdateLocalDmgDetailService,
  DeleteLocalDmgDetailService,
];

const queryHandlers: Provider[] = [
  FindLocalDmgDetailsQueryHandler,
  FindLocalDmgDetailQueryHandler,
];

const mappers: Provider[] = [LocalDmgDetailMapper];

const repositories: Provider[] = [
  {
    provide: LOCAL_DMG_DETAIL_REPOSITORY,
    useClass: PrismaLocalDmgDetailRepository,
  },
];

@Module({
  imports: [CqrsModule, forwardRef(() => SurveyModule)],
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
export class LocalDmgDetailModule {}
