import { Err, Ok, Result } from 'oxide.ts';
import { SURVEY_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindSurveyQuery {
  surveyId: bigint;

  constructor(public readonly id: bigint) {
    this.surveyId = id;
  }
}

export type FindSurveyQueryResult = Result<SurveyEntity, SurveyNotFoundError>;

@QueryHandler(FindSurveyQuery)
export class FindSurveyQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_REPOSITORY)
    protected readonly surveyRepo: SurveyRepositoryPort,
  ) {}

  async execute(query: FindSurveyQuery): Promise<FindSurveyQueryResult> {
    const found = await this.surveyRepo.findOneById(query.surveyId);
    if (found.isNone()) return Err(new SurveyNotFoundError());

    return Ok(found.unwrap());
  }
}
