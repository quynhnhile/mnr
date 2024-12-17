import { Err, Ok, Result } from 'oxide.ts';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindSurveyLocationQuery {
  surveyLocationId: bigint;

  constructor(public readonly id: bigint) {
    this.surveyLocationId = id;
  }
}

export type FindSurveyLocationQueryResult = Result<
  SurveyLocationEntity,
  SurveyLocationNotFoundError
>;

@QueryHandler(FindSurveyLocationQuery)
export class FindSurveyLocationQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_LOCATION_REPOSITORY)
    protected readonly surveyLocationRepo: SurveyLocationRepositoryPort,
  ) {}

  async execute(
    query: FindSurveyLocationQuery,
  ): Promise<FindSurveyLocationQueryResult> {
    const found = await this.surveyLocationRepo.findOneById(
      query.surveyLocationId,
    );
    if (found.isNone()) return Err(new SurveyLocationNotFoundError());

    return Ok(found.unwrap());
  }
}
