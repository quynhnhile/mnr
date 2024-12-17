import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateSurveyLocationHttpController } from './commands/create-survey-location/create-survey-location.http.controller';
import { CreateSurveyLocationService } from './commands/create-survey-location/create-survey-location.service';
import { DeleteSurveyLocationHttpController } from './commands/delete-survey-location/delete-survey-location.http.controller';
import { DeleteSurveyLocationService } from './commands/delete-survey-location/delete-survey-location.service';
import { UpdateSurveyLocationHttpController } from './commands/update-survey-location/update-survey-location.http.controller';
import { UpdateSurveyLocationService } from './commands/update-survey-location/update-survey-location.service';
import { PrismaSurveyLocationRepository } from './database/survey-location.repository.prisma';
import { SurveyLocationMapper } from './mappers/survey-location.mapper';
import { FindSurveyLocationHttpController } from './queries/find-survey-location/find-survey-location.http.controller';
import { FindSurveyLocationQueryHandler } from './queries/find-survey-location/find-survey-location.query-handler';
import { FindSurveyLocationsHttpController } from './queries/find-survey-locations/find-survey-locations.http.controller';
import { FindSurveyLocationsQueryHandler } from './queries/find-survey-locations/find-survey-locations.query-handler';
import { SURVEY_LOCATION_REPOSITORY } from './survey-location.di-tokens';

const httpControllers = [
  CreateSurveyLocationHttpController,
  FindSurveyLocationsHttpController,
  FindSurveyLocationHttpController,
  UpdateSurveyLocationHttpController,
  DeleteSurveyLocationHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateSurveyLocationService,
  UpdateSurveyLocationService,
  DeleteSurveyLocationService,
];

const queryHandlers: Provider[] = [
  FindSurveyLocationsQueryHandler,
  FindSurveyLocationQueryHandler,
];

const mappers: Provider[] = [SurveyLocationMapper];

const repositories: Provider[] = [
  {
    provide: SURVEY_LOCATION_REPOSITORY,
    useClass: PrismaSurveyLocationRepository,
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
export class SurveyLocationModule {}
