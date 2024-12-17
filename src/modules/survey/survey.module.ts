import { Logger, Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Validation } from '@src/libs/utils/validation';
import { ClassifyModule } from '../classify/classify.module';
import { CleanMethodModule } from '../clean-method/clean-method.module';
import { CleanModeModule } from '../clean-mode/clean-mode.module';
import { ConditionModule } from '../condition/condition.module';
import { ContainerModule } from '../container/container.module';
import { EstimateModule } from '../estimate/estimate.module';
import { InfoContModule } from '../info-cont/info-cont.module';
import { LocalDmgDetailModule } from '../local-dmg-detail/local-dmg-detail.module';
import { RepairContModule } from '../repair-cont/repair-cont.module';
import { RepairModule } from '../repair/repair.module';
import { SurveyLocationModule } from '../survey-location/survey-location.module';
import { VendorModule } from '../vendor/vendor.module';
import { CreateSurveyDetailHttpController } from './commands/create-survey-detail/create-survey-detail.http.controller';
import { CreateSurveyDetailService } from './commands/create-survey-detail/create-survey-detail.service';
import { CreateSurveyHttpController } from './commands/create-survey/create-survey.http.controller';
import { CreateSurveyService } from './commands/create-survey/create-survey.service';
import { DeleteSurveyDetailHttpController } from './commands/delete-survey-detail/delete-survey-detail.http.controller';
import { DeleteSurveyDetailService } from './commands/delete-survey-detail/delete-survey-detail.service';
import { DeleteSurveyHttpController } from './commands/delete-survey/delete-survey.http.controller';
import { DeleteSurveyService } from './commands/delete-survey/delete-survey.service';
import { FinishSurveyHttpController } from './commands/finish-survey/finish-survey.http.controller';
import { FinishSurveyService } from './commands/finish-survey/finish-survey.service';
import { UpdateSurveyDetailHttpController } from './commands/update-survey-detail/update-survey-detail.http.controller';
import { UpdateSurveyDetailService } from './commands/update-survey-detail/update-survey-detail.service';
import { UpdateSurveyHttpController } from './commands/update-survey/update-survey.http.controller';
import { UpdateSurveyService } from './commands/update-survey/update-survey.service';
import { PrismaSurveyDetailRepository } from './database/survey-detail.repository.prisma';
import { PrismaSurveyRepository } from './database/survey.repository.prisma';
import { SurveyDetailMapper } from './mappers/survey-detail.mapper';
import { SurveyMapper } from './mappers/survey.mapper';
import { FindSurveyDetailHttpController } from './queries/find-survey-detail/find-survey-detail.http.controller';
import { FindSurveyDetailQueryHandler } from './queries/find-survey-detail/find-survey-detail.query-handler';
import { FindSurveyDetailsHttpController } from './queries/find-survey-details/find-survey-details.http.controller';
import { FindSurveyDetailsQueryHandler } from './queries/find-survey-details/find-survey-details.query-handler';
import { FindSurveyHttpController } from './queries/find-survey/find-survey.http.controller';
import { FindSurveyQueryHandler } from './queries/find-survey/find-survey.query-handler';
import { FindSurveysHttpController } from './queries/find-surveys/find-surveys.http.controller';
import { FindSurveysQueryHandler } from './queries/find-surveys/find-surveys.query-handler';
import { SurveyService } from './services/survey.service';
import {
  SURVEY_DETAIL_REPOSITORY,
  SURVEY_REPOSITORY,
} from './survey.di-tokens';

const httpControllers = [
  CreateSurveyHttpController,
  FindSurveysHttpController,
  FindSurveyHttpController,
  UpdateSurveyHttpController,
  DeleteSurveyHttpController,
  FinishSurveyHttpController,

  CreateSurveyDetailHttpController,
  FindSurveyDetailsHttpController,
  FindSurveyDetailHttpController,
  UpdateSurveyDetailHttpController,
  DeleteSurveyDetailHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateSurveyService,
  UpdateSurveyService,
  DeleteSurveyService,
  FinishSurveyService,
  CreateSurveyDetailService,
  UpdateSurveyDetailService,
  DeleteSurveyDetailService,
];

const queryHandlers: Provider[] = [
  FindSurveysQueryHandler,
  FindSurveyQueryHandler,
  FindSurveyDetailsQueryHandler,
  FindSurveyDetailQueryHandler,
];

const mappers: Provider[] = [SurveyMapper, SurveyDetailMapper];

const utils: Provider[] = [Validation];

const repositories: Provider[] = [
  {
    provide: SURVEY_REPOSITORY,
    useClass: PrismaSurveyRepository,
  },
  {
    provide: SURVEY_DETAIL_REPOSITORY,
    useClass: PrismaSurveyDetailRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    InfoContModule,
    ContainerModule,
    SurveyLocationModule,
    ConditionModule,
    ClassifyModule,
    CleanMethodModule,
    CleanModeModule,
    VendorModule,
    forwardRef(() => LocalDmgDetailModule),
    forwardRef(() => RepairContModule),
    RepairModule,
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
    ...utils,
    SurveyService,
  ],
  exports: [...repositories],
})
export class SurveyModule {}
