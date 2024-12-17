import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { Prisma } from '@prisma/client';
import { SurveyEntity } from '../domain/survey.entity';

export interface FindOneBySurveyNoParams {
  surveyNo: string;
  containerNo?: string;
  isTankOutside?: boolean;
  isTankInside?: boolean;
}

export interface SurveyRepositoryPort extends RepositoryPort<SurveyEntity> {
  createSurvey(entity: SurveyEntity): Promise<SurveyEntity>;
  countCurrentIndex(): Promise<number>;
  findOneBySurveyNo(
    params: FindOneBySurveyNoParams,
  ): Promise<Option<SurveyEntity>>;
  findSurveyByContNoAndIdCont(
    params: Prisma.SurveyFindManyArgs,
  ): Promise<SurveyEntity[]>;
  findSurveyByContNoAndIdContAndIsException(
    params: Prisma.SurveyFindManyArgs,
  ): Promise<SurveyEntity[]>;
  findOneByIdRep(idRep: bigint): Promise<Option<SurveyEntity>>;
}
