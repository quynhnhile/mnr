import { Logger, Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CleanMethodModule } from '../clean-method/clean-method.module';
import { CleanModeModule } from '../clean-mode/clean-mode.module';
import { ComponentModule } from '../component/component.module';
import { DamageModule } from '../damage/damage.module';
import { PrismaJobRepairCleanRepository } from '../job-repair-clean/database/job-repair-clean.repository.prisma';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanModule } from '../job-repair-clean/job-repair-clean.module';
import { JobRepairCleanMapper } from '../job-repair-clean/mappers/job-repair-clean.mapper';
import { LocationModule } from '../location/location.module';
import { PayerModule } from '../payer/payer.module';
import { PrismaRepairContRepository } from '../repair-cont/database/repair-cont.repository.prisma';
import { RepairContMapper } from '../repair-cont/mappers/repair-cont.mapper';
import { REPAIR_CONT_REPOSITORY } from '../repair-cont/repair-cont.di-tokens';
import { RepairContModule } from '../repair-cont/repair-cont.module';
import { RepairModule } from '../repair/repair.module';
import { TariffGroupModule } from '../tariff-group/tariff-group.module';
import { TariffModule } from '../tariff/tariff.module';
import { VendorModule } from '../vendor/vendor.module';
import { EstimateDetailCreatedUpdatedDomainEventHandler } from './application/event-handlers/estimate-detail-created.domain-event-handler';
import { ApproveEstimateDetailHttpController } from './commands/approve-estimate-detail/approve-estimate-detail.http.controller';
import { ApproveEstimateDetailService } from './commands/approve-estimate-detail/approve-estimate-detail.service';
import { ApproveEstimateHttpController } from './commands/approve-estimate/approve-estimate.http.controller';
import { ApproveEstimateService } from './commands/approve-estimate/approve-estimate.service';
import { CalculateTariffHttpController } from './commands/calculate-tariff/calculate-tariff.http.controller';
import { CalculateTariffService } from './commands/calculate-tariff/calculate-tariff.service';
import { CancelEstimateDetailHttpController } from './commands/cancel-estimate-detail/cancel-estimate-detail.http.controller';
import { CancelEstimateDetailService } from './commands/cancel-estimate-detail/cancel-estimate-detail.service';
import { CancelEstimateHttpController } from './commands/cancel-estimate/cancel-estimate.http.controller';
import { CancelEstimateService } from './commands/cancel-estimate/cancel-estimate.service';
import { CompleteAllJobHttpController } from './commands/complete-all-job/complete-all-job.http.controller';
import { CompleteAllJobService } from './commands/complete-all-job/complete-all-job.service';
import { CreateEstimateDetailHttpController } from './commands/create-estimate-detail/create-estimate-detail.http.controller';
import { CreateEstimateDetailService } from './commands/create-estimate-detail/create-estimate-detail.service';
import { CreateEstimateHttpController } from './commands/create-estimate/create-estimate.http.controller';
import { CreateEstimateService } from './commands/create-estimate/create-estimate.service';
import { DeleteEstimateDetailHttpController } from './commands/delete-estimate-detail/delete-estimate-detail.http.controller';
import { DeleteEstimateDetailService } from './commands/delete-estimate-detail/delete-estimate-detail.service';
import { DeleteEstimateHttpController } from './commands/delete-estimate/delete-estimate.http.controller';
import { DeleteEstimateService } from './commands/delete-estimate/delete-estimate.service';
import { LocalApproveEstimateDetailHttpController } from './commands/local-approve-estimate-detail/local-approve-estimate-detail.http.controller';
import { LocalApproveEstimateDetailService } from './commands/local-approve-estimate-detail/local-approve-estimate-detail.service';
import { LocalApproveEstimateHttpController } from './commands/local-approve-estimate/local-approve-estimate.http.controller';
import { LocalApproveEstimateService } from './commands/local-approve-estimate/local-approve-estimate.service';
import { RequestActiveEstimateDetailHttpController } from './commands/request-active-estimate-detail/request-active-estimate-detail.http.controller';
import { RequestActiveEstimateDetailService } from './commands/request-active-estimate-detail/request-active-estimate-detail.service';
import { RequestActiveEstimateHttpController } from './commands/request-active-estimate/request-active-estimate.http.controller';
import { RequestActiveEstimateService } from './commands/request-active-estimate/request-active-estimate.service';
import { SendOprEstimateDetailHttpController } from './commands/send-opr-estimate-detail/send-opr-estimate-detail.http.controller';
import { SendOprEstimateDetailService } from './commands/send-opr-estimate-detail/send-opr-estimate-detail.service';
import { SendOprerationEstimatelHttpController } from './commands/send-opreration-estimate/send-opreration-estimate.http.controller';
import { SendOprerationEstimateService } from './commands/send-opreration-estimate/send-opreration-estimate.service';
import { StartAllJobHttpController } from './commands/start-all-job/start-all-job.http.controller';
import { StartAllJobService } from './commands/start-all-job/start-all-job.service';
import { UpdateEstimateDetailHttpController } from './commands/update-estimate-detail/update-estimate-detail.http.controller';
import { UpdateEstimateDetailService } from './commands/update-estimate-detail/update-estimate-detail.service';
import { UpdateEstimateHttpController } from './commands/update-estimate/update-estimate.http.controller';
import { UpdateEstimateService } from './commands/update-estimate/update-estimate.service';
import { PrismaEstimateDetailRepository } from './database/estimate-detail.repository.prisma';
import { PrismaEstimateRepository } from './database/estimate.repository.prisma';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from './estimate.di-tokens';
import { EstimateDetailMapper } from './mappers/estimate-detail.mapper';
import { EstimateMapper } from './mappers/estimate.mapper';
import { FindEstimateDetailHttpController } from './queries/find-estimate-detail/find-estimate-detail.http.controller';
import { FindEstimateDetailQueryHandler } from './queries/find-estimate-detail/find-estimate-detail.query-handler';
import { FindEstimateDetailsStartableHttpController } from './queries/find-estimate-details-startable/find-estimate-details-startable.http.controller';
import { FindEstimateDetailsStartableQueryHandler } from './queries/find-estimate-details-startable/find-estimate-details-startable.query-handler';
import { FindEstimateDetailsHttpController } from './queries/find-estimate-details/find-estimate-details.http.controller';
import { FindEstimateDetailsQueryHandler } from './queries/find-estimate-details/find-estimate-details.query-handler';
import { FindEstimateHttpController } from './queries/find-estimate/find-estimate.http.controller';
import { FindEstimateQueryHandler } from './queries/find-estimate/find-estimate.query-handler';
import { FindEstimatesHttpController } from './queries/find-estimates/find-estimates.http.controller';
import { FindEstimatesQueryHandler } from './queries/find-estimates/find-estimates.query-handler';
import { EstimateService } from './services/estimate.service';

// import { JobRepairCleanModule } from '../job-repair-clean/job-repair-clean.module';

// import { JobRepairCleanModule } from '../job-repair-clean/job-repair-clean.module';

const httpControllers = [
  CreateEstimateHttpController,
  FindEstimatesHttpController,
  FindEstimateHttpController,
  UpdateEstimateHttpController,
  LocalApproveEstimateHttpController,
  ApproveEstimateHttpController,
  CancelEstimateHttpController,
  RequestActiveEstimateHttpController,
  SendOprerationEstimatelHttpController,
  DeleteEstimateHttpController,

  CreateEstimateDetailHttpController,
  FindEstimateDetailsHttpController,
  FindEstimateDetailsStartableHttpController,
  FindEstimateDetailHttpController,
  UpdateEstimateDetailHttpController,
  LocalApproveEstimateDetailHttpController,
  ApproveEstimateDetailHttpController,
  CompleteAllJobHttpController,
  StartAllJobHttpController,
  CancelEstimateDetailHttpController,
  RequestActiveEstimateDetailHttpController,
  SendOprEstimateDetailHttpController,
  CalculateTariffHttpController,
  DeleteEstimateDetailHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateEstimateService,
  UpdateEstimateService,
  ApproveEstimateService,
  LocalApproveEstimateService,
  CancelEstimateService,
  SendOprerationEstimateService,
  RequestActiveEstimateService,
  DeleteEstimateService,

  CreateEstimateDetailService,
  UpdateEstimateDetailService,
  LocalApproveEstimateDetailService,
  ApproveEstimateDetailService,
  CompleteAllJobService,
  StartAllJobService,
  CancelEstimateDetailService,
  RequestActiveEstimateDetailService,
  SendOprEstimateDetailService,
  CalculateTariffService,
  DeleteEstimateDetailService,
];

const queryHandlers: Provider[] = [
  FindEstimatesQueryHandler,
  FindEstimateQueryHandler,

  FindEstimateDetailsQueryHandler,
  FindEstimateDetailsStartableQueryHandler,
  FindEstimateDetailQueryHandler,
];

const eventHandlers: Provider[] = [
  EstimateDetailCreatedUpdatedDomainEventHandler,
];

const mappers: Provider[] = [
  EstimateMapper,
  EstimateDetailMapper,
  JobRepairCleanMapper,
  RepairContMapper,
];

const repositories: Provider[] = [
  {
    provide: ESTIMATE_REPOSITORY,
    useClass: PrismaEstimateRepository,
  },
  {
    provide: ESTIMATE_DETAIL_REPOSITORY,
    useClass: PrismaEstimateDetailRepository,
  },
  {
    provide: JOB_REPAIR_CLEAN_REPOSITORY,
    useClass: PrismaJobRepairCleanRepository,
  },
  {
    provide: REPAIR_CONT_REPOSITORY,
    useClass: PrismaRepairContRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    ComponentModule,
    LocationModule,
    DamageModule,
    RepairModule,
    CleanMethodModule,
    CleanModeModule,
    PayerModule,
    forwardRef(() => RepairContModule),
    VendorModule,
    TariffGroupModule,
    TariffModule,
    forwardRef(() => JobRepairCleanModule),
  ],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
    EstimateService,
  ],
  exports: [...repositories, EstimateService],
})
export class EstimateModule {}
