import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CreateConditionHttpController } from './commands/create-condition/create-condition.http.controller';
import { CreateConditionService } from './commands/create-condition/create-condition.service';
import { DeleteConditionHttpController } from './commands/delete-condition/delete-condition.http.controller';
import { DeleteConditionService } from './commands/delete-condition/delete-condition.service';
import { UpdateConditionHttpController } from './commands/update-condition/update-condition.http.controller';
import { UpdateConditionService } from './commands/update-condition/update-condition.service';
import { CONDITION_REPOSITORY } from './condition.di-tokens';
import { PrismaConditionRepository } from './database/condition.repository.prisma';
import { ConditionMapper } from './mappers/condition.mapper';
import { FindConditionHttpController } from './queries/find-condition/find-condition.http.controller';
import { FindConditionQueryHandler } from './queries/find-condition/find-condition.query-handler';
import { FindConditionsHttpController } from './queries/find-conditions/find-conditions.http.controller';
import { FindConditionsQueryHandler } from './queries/find-conditions/find-conditions.query-handler';

const httpControllers = [
  CreateConditionHttpController,
  FindConditionsHttpController,
  FindConditionHttpController,
  UpdateConditionHttpController,
  DeleteConditionHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateConditionService,
  UpdateConditionService,
  DeleteConditionService,
];

const queryHandlers: Provider[] = [
  FindConditionsQueryHandler,
  FindConditionQueryHandler,
];

const mappers: Provider[] = [ConditionMapper];

const repositories: Provider[] = [
  {
    provide: CONDITION_REPOSITORY,
    useClass: PrismaConditionRepository,
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
export class ConditionModule {}
