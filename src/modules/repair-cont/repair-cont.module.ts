import { Logger, Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContainerModule } from '../container/container.module';
import { EstimateModule } from '../estimate/estimate.module';
import { SurveyModule } from '../survey/survey.module';
import { CreateRepairContHttpController } from './commands/create-repair-cont/create-repair-cont.http.controller';
import { CreateRepairContService } from './commands/create-repair-cont/create-repair-cont.service';
import { DeleteRepairContHttpController } from './commands/delete-repair-cont/delete-repair-cont.http.controller';
import { DeleteRepairContService } from './commands/delete-repair-cont/delete-repair-cont.service';
import { UpdateConditionClassifyCodeHttpController } from './commands/update-condition-classify-code/update-condition-classify-code.http.controller';
import { UpdateConditionClassifyCodeService } from './commands/update-condition-classify-code/update-condition-classify-code.service';
import { UpdateDataHttpController } from './commands/update-data/update-data.http.controller';
import { UpdateDataService } from './commands/update-data/update-data.service';
import { UpdateRepairContHttpController } from './commands/update-repair-cont/update-repair-cont.http.controller';
import { UpdateRepairContService } from './commands/update-repair-cont/update-repair-cont.service';
import { PrismaRepairContRepository } from './database/repair-cont.repository.prisma';
import { RepairContMapper } from './mappers/repair-cont.mapper';
import { FindRepairContByContainerNoHttpController } from './queries/find-repair-cont-by-cont-no/find-repair-cont-by-cont-no.http.controller';
import { FindRepairContByContainerNoQueryHandler } from './queries/find-repair-cont-by-cont-no/find-repair-cont-by-cont-no.query-handler';
import { FindRepairContHttpController } from './queries/find-repair-cont/find-repair-cont.http.controller';
import { FindRepairContQueryHandler } from './queries/find-repair-cont/find-repair-cont.query-handler';
import { FindRepairContsByContainerNosHttpController } from './queries/find-repair-conts-by-cont-nos/find-repair-conts-by-cont-nos.http.controller';
import { FindRepairContsByContainerNosQueryHandler } from './queries/find-repair-conts-by-cont-nos/find-repair-conts-by-cont-nos.query-handler';
import { FindRepairContsHttpController } from './queries/find-repair-conts/find-repair-conts.http.controller';
import { FindRepairContsQueryHandler } from './queries/find-repair-conts/find-repair-conts.query-handler';
import { QueryContByContNosHttpController } from './queries/query-cont-by-cont-nos/query-cont-by-cont-nos.http.controller';
import { QueryContByContNosQueryHandler } from './queries/query-cont-by-cont-nos/query-cont-by-cont-nos.query-handler';
import { QueryInfoContByContainerNoOrEstimateNoHttpController } from './queries/query-info-cont-by-cont-no-or-estimate-no/query-info-cont-by-cont-no-or-estimate-no.http.controller';
import { QueryInfoContByContNoOrEstimateNoQueryHandler } from './queries/query-info-cont-by-cont-no-or-estimate-no/query-info-cont-by-cont-no-or-estimate-no.query-handler';
import { REPAIR_CONT_REPOSITORY } from './repair-cont.di-tokens';

const httpControllers = [
  CreateRepairContHttpController,
  FindRepairContsHttpController,
  FindRepairContByContainerNoHttpController,
  QueryInfoContByContainerNoOrEstimateNoHttpController,
  QueryContByContNosHttpController,
  FindRepairContsByContainerNosHttpController,
  FindRepairContHttpController,
  UpdateRepairContHttpController,
  UpdateConditionClassifyCodeHttpController,
  UpdateDataHttpController,
  DeleteRepairContHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateRepairContService,
  UpdateRepairContService,
  UpdateConditionClassifyCodeService,
  UpdateDataService,
  DeleteRepairContService,
];

const queryHandlers: Provider[] = [
  FindRepairContsQueryHandler,
  FindRepairContQueryHandler,
  FindRepairContByContainerNoQueryHandler,
  FindRepairContsByContainerNosQueryHandler,
  QueryInfoContByContNoOrEstimateNoQueryHandler,
  QueryContByContNosQueryHandler,
];

const mappers: Provider[] = [RepairContMapper];

const repositories: Provider[] = [
  {
    provide: REPAIR_CONT_REPOSITORY,
    useClass: PrismaRepairContRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    ContainerModule,
    forwardRef(() => SurveyModule),
    forwardRef(() => EstimateModule),
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
export class RepairContModule {}
