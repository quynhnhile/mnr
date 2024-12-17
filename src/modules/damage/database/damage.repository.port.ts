import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { DamageEntity } from '../domain/damage.entity';

export interface DamageRepositoryPort extends RepositoryPort<DamageEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<DamageEntity>>;
  findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<DamageEntity>>;
}
