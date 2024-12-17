import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SYS_CONFIG_OPR_REPOSITORY } from './sys-config-opr.di-tokens';
import { CreateSysConfigOprHttpController } from './commands/create-sys-config-opr/create-sys-config-opr.http.controller';
import { CreateSysConfigOprService } from './commands/create-sys-config-opr/create-sys-config-opr.service';
import { DeleteSysConfigOprHttpController } from './commands/delete-sys-config-opr/delete-sys-config-opr.http.controller';
import { DeleteSysConfigOprService } from './commands/delete-sys-config-opr/delete-sys-config-opr.service';
import { UpdateSysConfigOprHttpController } from './commands/update-sys-config-opr/update-sys-config-opr.http.controller';
import { UpdateSysConfigOprService } from './commands/update-sys-config-opr/update-sys-config-opr.service';
import { PrismaSysConfigOprRepository } from './database/sys-config-opr.repository.prisma';
import { SysConfigOprMapper } from './mappers/sys-config-opr.mapper';
import { FindSysConfigOprHttpController } from './queries/find-sys-config-opr/find-sys-config-opr.http.controller';
import { FindSysConfigOprQueryHandler } from './queries/find-sys-config-opr/find-sys-config-opr.query-handler';
import { FindSysConfigOprsHttpController } from './queries/find-sys-config-oprs/find-sys-config-oprs.http.controller';
import { FindSysConfigOprsQueryHandler } from './queries/find-sys-config-oprs/find-sys-config-oprs.query-handler';

const httpControllers = [
  CreateSysConfigOprHttpController,
  FindSysConfigOprsHttpController,
  FindSysConfigOprHttpController,
  UpdateSysConfigOprHttpController,
  DeleteSysConfigOprHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateSysConfigOprService,
  UpdateSysConfigOprService,
  DeleteSysConfigOprService,
];

const queryHandlers: Provider[] = [
  FindSysConfigOprsQueryHandler,
  FindSysConfigOprQueryHandler,
];

const mappers: Provider[] = [SysConfigOprMapper];

const repositories: Provider[] = [
  {
    provide: SYS_CONFIG_OPR_REPOSITORY,
    useClass: PrismaSysConfigOprRepository,
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
export class SysConfigOprModule {}
