import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { CleanModeEntity } from '../domain/clean-mode.entity';

export interface CleanModeRepositoryPort
  extends RepositoryPort<CleanModeEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<CleanModeEntity>>;
  findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<CleanModeEntity>>;
}
