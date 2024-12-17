import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DAMAGE_LOCAL_REPOSITORY } from './damage-local.di-tokens';
import { CreateDamageLocalHttpController } from './commands/create-damage-local/create-damage-local.http.controller';
import { CreateDamageLocalService } from './commands/create-damage-local/create-damage-local.service';
import { DeleteDamageLocalHttpController } from './commands/delete-damage-local/delete-damage-local.http.controller';
import { DeleteDamageLocalService } from './commands/delete-damage-local/delete-damage-local.service';
import { UpdateDamageLocalHttpController } from './commands/update-damage-local/update-damage-local.http.controller';
import { UpdateDamageLocalService } from './commands/update-damage-local/update-damage-local.service';
import { PrismaDamageLocalRepository } from './database/damage-local.repository.prisma';
import { DamageLocalMapper } from './mappers/damage-local.mapper';
import { FindDamageLocalHttpController } from './queries/find-damage-local/find-damage-local.http.controller';
import { FindDamageLocalQueryHandler } from './queries/find-damage-local/find-damage-local.query-handler';
import { FindDamageLocalsHttpController } from './queries/find-damage-locals/find-damage-locals.http.controller';
import { FindDamageLocalsQueryHandler } from './queries/find-damage-locals/find-damage-locals.query-handler';

const httpControllers = [
  CreateDamageLocalHttpController,
  FindDamageLocalsHttpController,
  FindDamageLocalHttpController,
  UpdateDamageLocalHttpController,
  DeleteDamageLocalHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateDamageLocalService,
  UpdateDamageLocalService,
  DeleteDamageLocalService,
];

const queryHandlers: Provider[] = [
  FindDamageLocalsQueryHandler,
  FindDamageLocalQueryHandler,
];

const mappers: Provider[] = [DamageLocalMapper];

const repositories: Provider[] = [
  {
    provide: DAMAGE_LOCAL_REPOSITORY,
    useClass: PrismaDamageLocalRepository,
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
export class DamageLocalModule {}
