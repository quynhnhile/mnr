import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, SurveyLocation as SurveyLocationModel } from '@prisma/client';
import { SurveyLocationEntity } from '../domain/survey-location.entity';
import { SurveyLocationMapper } from '../mappers/survey-location.mapper';
import { SurveyLocationRepositoryPort } from './survey-location.repository.port';

export const SurveyLocationScalarFieldEnum =
  Prisma.SurveyLocationScalarFieldEnum;

@Injectable()
export class PrismaSurveyLocationRepository
  extends PrismaMultiTenantRepositoryBase<
    SurveyLocationEntity,
    SurveyLocationModel
  >
  implements SurveyLocationRepositoryPort
{
  protected modelName = 'surveyLocation';

  constructor(
    private manager: PrismaClientManager,
    mapper: SurveyLocationMapper,
  ) {
    super(manager, mapper);
  }

  async findOneByCode(code: string): Promise<Option<SurveyLocationEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.surveyLocation.findFirst({
      where: { surveyLocationCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
