import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, SurveyDetail as SurveyDetailModel } from '@prisma/client';
import { SurveyDetailEntity } from '../domain/survey-detail.entity';
import { SurveyDetailMapper } from '../mappers/survey-detail.mapper';
import { SurveyDetailRepositoryPort } from './survey-detail.repository.port';

export const SurveyDetailScalarFieldEnum = Prisma.SurveyDetailScalarFieldEnum;

@Injectable()
export class PrismaSurveyDetailRepository
  extends PrismaMultiTenantRepositoryBase<SurveyDetailEntity, SurveyDetailModel>
  implements SurveyDetailRepositoryPort
{
  protected modelName = 'surveyDetail';

  constructor(
    private manager: PrismaClientManager,
    mapper: SurveyDetailMapper,
  ) {
    super(manager, mapper);
  }
}
