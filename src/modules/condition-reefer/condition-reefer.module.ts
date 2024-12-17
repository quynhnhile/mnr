import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CONDITION_REEFER_REPOSITORY } from './condition-reefer.di-tokens';
import { CreateConditionReeferHttpController } from './commands/create-condition-reefer/create-condition-reefer.http.controller';
import { CreateConditionReeferService } from './commands/create-condition-reefer/create-condition-reefer.service';
import { DeleteConditionReeferHttpController } from './commands/delete-condition-reefer/delete-condition-reefer.http.controller';
import { DeleteConditionReeferService } from './commands/delete-condition-reefer/delete-condition-reefer.service';
import { UpdateConditionReeferHttpController } from './commands/update-condition-reefer/update-condition-reefer.http.controller';
import { UpdateConditionReeferService } from './commands/update-condition-reefer/update-condition-reefer.service';
import { PrismaConditionReeferRepository } from './database/condition-reefer.repository.prisma';
import { ConditionReeferMapper } from './mappers/condition-reefer.mapper';
import { FindConditionReeferHttpController } from './queries/find-condition-reefer/find-condition-reefer.http.controller';
import { FindConditionReeferQueryHandler } from './queries/find-condition-reefer/find-condition-reefer.query-handler';
import { FindConditionReefersHttpController } from './queries/find-condition-reefers/find-condition-reefers.http.controller';
import { FindConditionReefersQueryHandler } from './queries/find-condition-reefers/find-condition-reefers.query-handler';

const httpControllers = [
  CreateConditionReeferHttpController,
  FindConditionReefersHttpController,
  FindConditionReeferHttpController,
  UpdateConditionReeferHttpController,
  DeleteConditionReeferHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateConditionReeferService,
  UpdateConditionReeferService,
  DeleteConditionReeferService,
];

const queryHandlers: Provider[] = [
  FindConditionReefersQueryHandler,
  FindConditionReeferQueryHandler,
];

const mappers: Provider[] = [ConditionReeferMapper];

const repositories: Provider[] = [
  {
    provide: CONDITION_REEFER_REPOSITORY,
    useClass: PrismaConditionReeferRepository,
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
export class ConditionReeferModule {}
