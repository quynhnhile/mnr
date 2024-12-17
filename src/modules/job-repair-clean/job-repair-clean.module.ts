import { Logger, Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EstimateModule } from '../estimate/estimate.module';
import { RepairContModule } from '../repair-cont/repair-cont.module';
import { RepairModule } from '../repair/repair.module';
import { VendorModule } from '../vendor/vendor.module';
import { CancelJobRepairCleanItemHttpController } from './commands/cancel-job-repair-clean-item/cancel-job-repair-clean-item.http.controller';
import { CancelJobRepairCleanItemService } from './commands/cancel-job-repair-clean-item/cancel-job-repair-clean-item.service';
import { CompleteJobRepairCleanHttpController } from './commands/complete-job-repair-clean/complete-job-repair-clean.http.controller';
import { CompleteJobRepairCleanService } from './commands/complete-job-repair-clean/complete-job-repair-clean.service';
import { CreateJobRepairCleanHttpController } from './commands/create-job-repair-clean/create-job-repair-clean.http.controller';
import { CreateJobRepairCleanService } from './commands/create-job-repair-clean/create-job-repair-clean.service';
import { DeleteJobRepairCleanHttpController } from './commands/delete-job-repair-clean/delete-job-repair-clean.http.controller';
import { DeleteJobRepairCleanService } from './commands/delete-job-repair-clean/delete-job-repair-clean.service';
import { FinishJobRepairCleanHttpController } from './commands/finish-job-repair-clean/finish-job-repair-clean.http.controller';
import { FinishJobRepairCleanService } from './commands/finish-job-repair-clean/finish-job-repair-clean.service';
import { KcsJobRepairCleanHttpController } from './commands/kcs-job-repair-clean/kcs-job-repair-clean.http.controller';
import { KcsJobRepairCleanService } from './commands/kcs-job-repair-clean/kcs-job-repair-clean.service';
import { StartJobRepairCleanItemHttpController } from './commands/start-job-repair-clean-item/start-job-repair-clean-item.http.controller';
import { StartJobRepairCleanItemService } from './commands/start-job-repair-clean-item/start-job-repair-clean-item.service';
import { UpdateJobRepairCleanHttpController } from './commands/update-job-repair-clean/update-job-repair-clean.http.controller';
import { UpdateJobRepairCleanService } from './commands/update-job-repair-clean/update-job-repair-clean.service';
import { PrismaJobRepairCleanRepository } from './database/job-repair-clean.repository.prisma';
import { JOB_REPAIR_CLEAN_REPOSITORY } from './job-repair-clean.di-tokens';
import { JobRepairCleanMapper } from './mappers/job-repair-clean.mapper';
import { FindJobRepairCleanHttpController } from './queries/find-job-repair-clean/find-job-repair-clean.http.controller';
import { FindJobRepairCleanQueryHandler } from './queries/find-job-repair-clean/find-job-repair-clean.query-handler';
import { FindJobRepairCleansHttpController } from './queries/find-job-repair-cleans/find-job-repair-cleans.http.controller';
import { FindJobRepairCleansQueryHandler } from './queries/find-job-repair-cleans/find-job-repair-cleans.query-handler';
import { JobRepairCleanService } from './services/job-repair-clean.service';

const httpControllers = [
  CreateJobRepairCleanHttpController,
  FindJobRepairCleansHttpController,
  FindJobRepairCleanHttpController,
  StartJobRepairCleanItemHttpController,
  FinishJobRepairCleanHttpController,
  CancelJobRepairCleanItemHttpController,
  KcsJobRepairCleanHttpController,
  CompleteJobRepairCleanHttpController,
  UpdateJobRepairCleanHttpController,
  DeleteJobRepairCleanHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateJobRepairCleanService,
  StartJobRepairCleanItemService,
  FinishJobRepairCleanService,
  CancelJobRepairCleanItemService,
  CompleteJobRepairCleanService,
  KcsJobRepairCleanService,
  UpdateJobRepairCleanService,
  DeleteJobRepairCleanService,
];

const queryHandlers: Provider[] = [
  FindJobRepairCleansQueryHandler,
  FindJobRepairCleanQueryHandler,
];

const mappers: Provider[] = [JobRepairCleanMapper];

const repositories: Provider[] = [
  {
    provide: JOB_REPAIR_CLEAN_REPOSITORY,
    useClass: PrismaJobRepairCleanRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    RepairContModule,
    forwardRef(() => EstimateModule),
    VendorModule,
    RepairModule,
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
    JobRepairCleanService,
  ],
  exports: [...repositories, JobRepairCleanService],
})
export class JobRepairCleanModule {}
