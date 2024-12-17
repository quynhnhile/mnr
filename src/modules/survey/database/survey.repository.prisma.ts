import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, Survey as SurveyModel } from '@prisma/client';
import { SurveyEntity } from '../domain/survey.entity';
import { SurveyMapper } from '../mappers/survey.mapper';
import {
  FindOneBySurveyNoParams,
  SurveyRepositoryPort,
} from './survey.repository.port';

export const SurveyScalarFieldEnum = Prisma.SurveyScalarFieldEnum;

@Injectable()
export class PrismaSurveyRepository
  extends PrismaMultiTenantRepositoryBase<SurveyEntity, SurveyModel>
  implements SurveyRepositoryPort
{
  protected modelName = 'survey';

  constructor(private manager: PrismaClientManager, mapper: SurveyMapper) {
    super(manager, mapper);
  }

  async createSurvey(entity: SurveyEntity): Promise<SurveyEntity> {
    const client = await this._getClient();

    const record = this.mapper.toPersistence(entity);
    delete (record as any).id; // remove id

    const result = await client.survey.create({
      data: record,
      include: { surveyDetails: true },
    });

    return this.mapper.toDomain(result);
  }

  async countCurrentIndex(): Promise<number> {
    // Get client by context
    const client = await this._getClient();

    return client.survey.count({});
  }

  async findOneBySurveyNo({
    surveyNo,
    containerNo,
    isTankOutside,
    isTankInside,
  }: FindOneBySurveyNoParams): Promise<Option<SurveyEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.survey.findFirst({
      where: { surveyNo, containerNo, isTankOutside, isTankInside },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findSurveyByContNoAndIdCont(
    params: Prisma.SurveyFindManyArgs,
  ): Promise<SurveyEntity[]> {
    const client = await this._getClient();

    const result = await client.survey.findMany(params);
    return result.map(this.mapper.toDomain);
  }

  async findSurveyByContNoAndIdContAndIsException(
    params: Prisma.SurveyFindManyArgs,
  ): Promise<SurveyEntity[]> {
    const client = await this._getClient();

    const result = await client.survey.findMany(params);
    return result.map(this.mapper.toDomain);
  }

  async findOneByIdRep(idRep: bigint): Promise<Option<SurveyEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.survey.findFirst({
      where: { idRep },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }
}
