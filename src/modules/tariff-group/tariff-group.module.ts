import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { VendorModule } from '../vendor/vendor.module';
import { CreateTariffGroupHttpController } from './commands/create-tariff-group/create-tariff-group.http.controller';
import { CreateTariffGroupService } from './commands/create-tariff-group/create-tariff-group.service';
import { DeleteTariffGroupHttpController } from './commands/delete-tariff-group/delete-tariff-group.http.controller';
import { DeleteTariffGroupService } from './commands/delete-tariff-group/delete-tariff-group.service';
import { UpdateOperationHttpController } from './commands/update-operation/update-tariff-group.http.controller';
import { UpdateOperationService } from './commands/update-operation/update-tariff-group.service';
import { UpdateTariffGroupHttpController } from './commands/update-tariff-group/update-tariff-group.http.controller';
import { UpdateTariffGroupService } from './commands/update-tariff-group/update-tariff-group.service';
import { PrismaTariffGroupRepository } from './database/tariff-group.repository.prisma';
import { TariffGroupMapper } from './mappers/tariff-group.mapper';
import { FindTariffGroupHttpController } from './queries/find-tariff-group/find-tariff-group.http.controller';
import { FindTariffGroupQueryHandler } from './queries/find-tariff-group/find-tariff-group.query-handler';
import { FindTariffGroupsHttpController } from './queries/find-tariff-groups/find-tariff-groups.http.controller';
import { FindTariffGroupsQueryHandler } from './queries/find-tariff-groups/find-tariff-groups.query-handler';
import { TARIFF_GROUP_REPOSITORY } from './tariff-group.di-tokens';

const httpControllers = [
  CreateTariffGroupHttpController,
  FindTariffGroupsHttpController,
  FindTariffGroupHttpController,
  UpdateTariffGroupHttpController,
  UpdateOperationHttpController,
  DeleteTariffGroupHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateTariffGroupService,
  UpdateTariffGroupService,
  UpdateOperationService,
  DeleteTariffGroupService,
];

const queryHandlers: Provider[] = [
  FindTariffGroupsQueryHandler,
  FindTariffGroupQueryHandler,
];

const mappers: Provider[] = [TariffGroupMapper];

const repositories: Provider[] = [
  {
    provide: TARIFF_GROUP_REPOSITORY,
    useClass: PrismaTariffGroupRepository,
  },
];

@Module({
  imports: [CqrsModule, OperationModule, VendorModule],
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
export class TariffGroupModule {}
