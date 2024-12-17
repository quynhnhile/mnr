import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePayerHttpController } from './commands/create-payer/create-payer.http.controller';
import { CreatePayerService } from './commands/create-payer/create-payer.service';
import { DeletePayerHttpController } from './commands/delete-payer/delete-payer.http.controller';
import { DeletePayerService } from './commands/delete-payer/delete-payer.service';
import { UpdatePayerHttpController } from './commands/update-payer/update-payer.http.controller';
import { UpdatePayerService } from './commands/update-payer/update-payer.service';
import { PrismaPayerRepository } from './database/payer.repository.prisma';
import { PayerMapper } from './mappers/payer.mapper';
import { PAYER_REPOSITORY } from './payer.di-tokens';
import { FindPayerHttpController } from './queries/find-payer/find-payer.http.controller';
import { FindPayerQueryHandler } from './queries/find-payer/find-payer.query-handler';
import { FindPayersHttpController } from './queries/find-payers/find-payers.http.controller';
import { FindPayersQueryHandler } from './queries/find-payers/find-payers.query-handler';

const httpControllers = [
  CreatePayerHttpController,
  FindPayersHttpController,
  FindPayerHttpController,
  UpdatePayerHttpController,
  DeletePayerHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreatePayerService,
  UpdatePayerService,
  DeletePayerService,
];

const queryHandlers: Provider[] = [
  FindPayersQueryHandler,
  FindPayerQueryHandler,
];

const mappers: Provider[] = [PayerMapper];

const repositories: Provider[] = [
  {
    provide: PAYER_REPOSITORY,
    useClass: PrismaPayerRepository,
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
export class PayerModule {}
