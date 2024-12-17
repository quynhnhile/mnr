import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateRepairHttpController } from './commands/create-repair/create-repair.http.controller';
import { CreateRepairService } from './commands/create-repair/create-repair.service';
import { DeleteRepairHttpController } from './commands/delete-repair/delete-repair.http.controller';
import { DeleteRepairService } from './commands/delete-repair/delete-repair.service';
import { UpdateRepairHttpController } from './commands/update-repair/update-repair.http.controller';
import { UpdateRepairService } from './commands/update-repair/update-repair.service';
import { PrismaRepairRepository } from './database/repair.repository.prisma';
import { RepairMapper } from './mappers/repair.mapper';
import { FindRepairHttpController } from './queries/find-repair/find-repair.http.controller';
import { FindRepairQueryHandler } from './queries/find-repair/find-repair.query-handler';
import { FindRepairsHttpController } from './queries/find-repairs/find-repairs.http.controller';
import { FindRepairsQueryHandler } from './queries/find-repairs/find-repairs.query-handler';
import { REPAIR_REPOSITORY } from './repair.di-tokens';

const httpControllers = [
  CreateRepairHttpController,
  FindRepairsHttpController,
  FindRepairHttpController,
  UpdateRepairHttpController,
  DeleteRepairHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateRepairService,
  UpdateRepairService,
  DeleteRepairService,
];

const queryHandlers: Provider[] = [
  FindRepairsQueryHandler,
  FindRepairQueryHandler,
];

const mappers: Provider[] = [RepairMapper];

const repositories: Provider[] = [
  {
    provide: REPAIR_REPOSITORY,
    useClass: PrismaRepairRepository,
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
export class RepairModule {}
