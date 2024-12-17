import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { StatusTypeEntity } from '../domain/status-type.entity';

export interface StatusTypeRepositoryPort
  extends RepositoryPort<StatusTypeEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<StatusTypeEntity>>;
}
