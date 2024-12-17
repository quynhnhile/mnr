import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CreateDamageHttpController } from './commands/create-damage/create-damage.http.controller';
import { CreateDamageService } from './commands/create-damage/create-damage.service';
import { DeleteDamageHttpController } from './commands/delete-damage/delete-damage.http.controller';
import { DeleteDamageService } from './commands/delete-damage/delete-damage.service';
import { UpdateDamageHttpController } from './commands/update-damage/update-damage.http.controller';
import { UpdateDamageService } from './commands/update-damage/update-damage.service';
import { DAMAGE_REPOSITORY } from './damage.di-tokens';
import { PrismaDamageRepository } from './database/damage.repository.prisma';
import { DamageMapper } from './mappers/damage.mapper';
import { FindDamageHttpController } from './queries/find-damage/find-damage.http.controller';
import { FindDamageQueryHandler } from './queries/find-damage/find-damage.query-handler';
import { FindDamagesHttpController } from './queries/find-damages/find-damages.http.controller';
import { FindDamagesQueryHandler } from './queries/find-damages/find-damages.query-handler';

const httpControllers = [
  CreateDamageHttpController,
  FindDamagesHttpController,
  FindDamageHttpController,
  UpdateDamageHttpController,
  DeleteDamageHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateDamageService,
  UpdateDamageService,
  DeleteDamageService,
];

const queryHandlers: Provider[] = [
  FindDamagesQueryHandler,
  FindDamageQueryHandler,
];

const mappers: Provider[] = [DamageMapper];

const repositories: Provider[] = [
  {
    provide: DAMAGE_REPOSITORY,
    useClass: PrismaDamageRepository,
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
export class DamageModule {}
