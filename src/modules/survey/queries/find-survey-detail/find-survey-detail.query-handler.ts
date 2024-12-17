import { Err, Ok, Result } from 'oxide.ts';
import { SurveyDetailRepositoryPort } from '@modules/survey/database/survey-detail.repository.port';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyDetailNotFoundError } from '@modules/survey/domain/survey-detail.error';
import { SURVEY_DETAIL_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindSurveyDetailQuery {
  surveyDetailId: bigint;

  constructor(public readonly id: bigint) {
    this.surveyDetailId = id;
  }
}

export type FindSurveyDetailQueryResult = Result<
  SurveyDetailEntity,
  SurveyDetailNotFoundError
>;

@QueryHandler(FindSurveyDetailQuery)
export class FindSurveyDetailQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_DETAIL_REPOSITORY)
    protected readonly surveyDetailRepo: SurveyDetailRepositoryPort,
  ) {}

  async execute(
    query: FindSurveyDetailQuery,
  ): Promise<FindSurveyDetailQueryResult> {
    const found = await this.surveyDetailRepo.findOneById(query.surveyDetailId);
    if (found.isNone()) return Err(new SurveyDetailNotFoundError());

    return Ok(found.unwrap());
  }
}
