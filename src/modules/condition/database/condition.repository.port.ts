import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { ConditionEntity } from '../domain/condition.entity';

export interface ConditionRepositoryPort
  extends RepositoryPort<ConditionEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<ConditionEntity>>;
  findOneByCode({
    code,
    operationCode,
    isDamage,
    isMachine,
  }: {
    code: string;
    operationCode?: string;
    isDamage?: boolean;
    isMachine?: boolean;
  }): Promise<Option<ConditionEntity>>;
}
