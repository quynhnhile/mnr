import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { RepairEntity } from '../domain/repair.entity';

export interface RepairRepositoryPort extends RepositoryPort<RepairEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<RepairEntity>>;
  findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<RepairEntity>>;
}
