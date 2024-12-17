import { RepositoryPort } from '@libs/ddd';
import { ConditionReeferEntity } from '../domain/condition-reefer.entity';

export type ConditionReeferRepositoryPort =
  RepositoryPort<ConditionReeferEntity>;
