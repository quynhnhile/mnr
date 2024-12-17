import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindSurveyLocationsQuery extends PrismaPaginatedQueryBase<Prisma.SurveyLocationWhereInput> {}

export type FindSurveyLocationsQueryResult = Result<
  Paginated<SurveyLocationEntity>,
  void
>;

@QueryHandler(FindSurveyLocationsQuery)
export class FindSurveyLocationsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SURVEY_LOCATION_REPOSITORY)
    protected readonly surveyLocationRepo: SurveyLocationRepositoryPort,
  ) {}

  async execute(
    query: FindSurveyLocationsQuery,
  ): Promise<FindSurveyLocationsQueryResult> {
    const result = await this.surveyLocationRepo.findAllPaginated(query);

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
