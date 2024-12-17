import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { SurveyLocationEntity } from '../domain/survey-location.entity';

export interface SurveyLocationRepositoryPort
  extends RepositoryPort<SurveyLocationEntity> {
  findOneByCode(code: string): Promise<Option<SurveyLocationEntity>>;
}
