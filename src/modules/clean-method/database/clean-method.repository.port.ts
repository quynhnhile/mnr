import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { CleanMethodEntity } from '../domain/clean-method.entity';

export interface CleanMethodRepositoryPort
  extends RepositoryPort<CleanMethodEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<CleanMethodEntity>>;
  findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<CleanMethodEntity>>;
}
