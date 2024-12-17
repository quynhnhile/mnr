import { RepositoryPort } from '@libs/ddd';
import { SurveyDetailEntity } from '../domain/survey-detail.entity';

export type SurveyDetailRepositoryPort = RepositoryPort<SurveyDetailEntity>;
