import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ComponentModule } from '../component/component.module';
import { DamageModule } from '../damage/damage.module';
import { LocationModule } from '../location/location.module';
import { RepairModule } from '../repair/repair.module';
import { TariffGroupModule } from '../tariff-group/tariff-group.module';
import { CreateTariffHttpController } from './commands/create-tariff/create-tariff.http.controller';
import { CreateTariffService } from './commands/create-tariff/create-tariff.service';
import { DeleteTariffHttpController } from './commands/delete-tariff/delete-tariff.http.controller';
import { DeleteTariffService } from './commands/delete-tariff/delete-tariff.service';
import { UpdateTariffHttpController } from './commands/update-tariff/update-tariff.http.controller';
import { UpdateTariffService } from './commands/update-tariff/update-tariff.service';
import { PrismaTariffRepository } from './database/tariff.repository.prisma';
import { TariffMapper } from './mappers/tariff.mapper';
import { FindTariffHttpController } from './queries/find-tariff/find-tariff.http.controller';
import { FindTariffQueryHandler } from './queries/find-tariff/find-tariff.query-handler';
import { FindTariffsHttpController } from './queries/find-tariffs/find-tariffs.http.controller';
import { FindTariffsQueryHandler } from './queries/find-tariffs/find-tariffs.query-handler';
import { TARIFF_REPOSITORY } from './tariff.di-tokens';

const httpControllers = [
  CreateTariffHttpController,
  FindTariffsHttpController,
  FindTariffHttpController,
  UpdateTariffHttpController,
  DeleteTariffHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateTariffService,
  UpdateTariffService,
  DeleteTariffService,
];

const queryHandlers: Provider[] = [
  FindTariffsQueryHandler,
  FindTariffQueryHandler,
];

const mappers: Provider[] = [TariffMapper];

const repositories: Provider[] = [
  {
    provide: TARIFF_REPOSITORY,
    useClass: PrismaTariffRepository,
  },
];

@Module({
  imports: [
    CqrsModule,

    ComponentModule,
    LocationModule,
    RepairModule,
    DamageModule,
    TariffGroupModule,
  ],
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
export class TariffModule {}
