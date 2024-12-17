import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { SurveyDetailRepositoryPort } from '@modules/survey/database/survey-detail.repository.port';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SURVEY_DETAIL_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindSurveyDetailsQuery extends PrismaPaginatedQueryBase<Prisma.SurveyDetailWhereInput> {}

export type FindSurveyDetailsQueryResult = Result<
  Paginated<SurveyDetailEntity>,
  void
>;

@QueryHandler(FindSurveyDetailsQuery)
export class FindSurveyDetailsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_DETAIL_REPOSITORY)
    protected readonly surveyDetailRepo: SurveyDetailRepositoryPort,
  ) {}

  async execute(
    query: FindSurveyDetailsQuery,
  ): Promise<FindSurveyDetailsQueryResult> {
    const result = await this.surveyDetailRepo.findAllPaginated(query);

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
