import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContainerModule } from '../container/container.module';
import { ReportCleaningAndRepairRepository } from './cleaning-and-repair/database/cleaning-and-repair.repository.prisma';
import { ReportCleaningAndRepairHttpController } from './cleaning-and-repair/queries/cleaning-and-repair/cleaning-and-repair.http.controller';
import { GetCleaningAndRepairQueryHandler } from './cleaning-and-repair/queries/cleaning-and-repair/cleaning-and-repair.query-handler';
import { REPORT_CLEANINGANDREPAIR_REPOSITORY } from './report.di-token';

const httpControllers = [ReportCleaningAndRepairHttpController];

const messageControllers = [];

const queryHandlers: Provider[] = [GetCleaningAndRepairQueryHandler];

const repositories: Provider[] = [
  {
    provide: REPORT_CLEANINGANDREPAIR_REPOSITORY,
    useClass: ReportCleaningAndRepairRepository,
  },
];

@Module({
  imports: [CqrsModule, ContainerModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [Logger, ...repositories, ...queryHandlers],
  exports: [...repositories],
})
export class ReportModule {}
