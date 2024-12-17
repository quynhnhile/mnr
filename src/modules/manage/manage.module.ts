import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContainerModule } from '../container/container.module';
import { MANAGE_REPAIRCONT_REPOSITORY } from './manage.di-token';
import { ManageRepairContainerRepository } from './repair-container/database/repair-container.repository.prisma';
import { ManageRepairContainerHttpController } from './repair-container/queries/repair-container/repair-container.http.controller';
import { GetManageRepairContainerQueryHandler } from './repair-container/queries/repair-container/repair-container.query-handler';

const httpControllers = [ManageRepairContainerHttpController];

const messageControllers = [];

const queryHandlers: Provider[] = [GetManageRepairContainerQueryHandler];

const repositories: Provider[] = [
  {
    provide: MANAGE_REPAIRCONT_REPOSITORY,
    useClass: ManageRepairContainerRepository,
  },
];

@Module({
  imports: [CqrsModule, ContainerModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [Logger, ...repositories, ...queryHandlers],
  exports: [...repositories],
})
export class ManageModule {}
