import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SURVEY_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindSurveysQuery extends PrismaPaginatedQueryBase<Prisma.SurveyWhereInput> {}

export type FindSurveysQueryResult = Result<Paginated<SurveyEntity>, void>;

@QueryHandler(FindSurveysQuery)
export class FindSurveysQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_REPOSITORY)
    protected readonly surveyRepo: SurveyRepositoryPort,
  ) {}

  async execute(query: FindSurveysQuery): Promise<FindSurveysQueryResult> {
    const result = await this.surveyRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
