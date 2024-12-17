import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MNR_OVER_REPOSITORY } from './mnr-over.di-tokens';
import { CreateMnrOverHttpController } from './commands/create-mnr-over/create-mnr-over.http.controller';
import { CreateMnrOverService } from './commands/create-mnr-over/create-mnr-over.service';
import { DeleteMnrOverHttpController } from './commands/delete-mnr-over/delete-mnr-over.http.controller';
import { DeleteMnrOverService } from './commands/delete-mnr-over/delete-mnr-over.service';
import { UpdateMnrOverHttpController } from './commands/update-mnr-over/update-mnr-over.http.controller';
import { UpdateMnrOverService } from './commands/update-mnr-over/update-mnr-over.service';
import { PrismaMnrOverRepository } from './database/mnr-over.repository.prisma';
import { MnrOverMapper } from './mappers/mnr-over.mapper';
import { FindMnrOverHttpController } from './queries/find-mnr-over/find-mnr-over.http.controller';
import { FindMnrOverQueryHandler } from './queries/find-mnr-over/find-mnr-over.query-handler';
import { FindMnrOversHttpController } from './queries/find-mnr-overs/find-mnr-overs.http.controller';
import { FindMnrOversQueryHandler } from './queries/find-mnr-overs/find-mnr-overs.query-handler';

const httpControllers = [
  CreateMnrOverHttpController,
  FindMnrOversHttpController,
  FindMnrOverHttpController,
  UpdateMnrOverHttpController,
  DeleteMnrOverHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateMnrOverService,
  UpdateMnrOverService,
  DeleteMnrOverService,
];

const queryHandlers: Provider[] = [
  FindMnrOversQueryHandler,
  FindMnrOverQueryHandler,
];

const mappers: Provider[] = [MnrOverMapper];

const repositories: Provider[] = [
  {
    provide: MNR_OVER_REPOSITORY,
    useClass: PrismaMnrOverRepository,
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
export class MnrOverModule {}
