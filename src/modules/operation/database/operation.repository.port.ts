import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { OperationEntity } from '../domain/operation.entity';

export interface OperationRepositoryPort
  extends RepositoryPort<OperationEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<OperationEntity>>;
  findOneByCode(code: string): Promise<Option<OperationEntity>>;
  findManyByCodes(codes: string[]): Promise<OperationEntity[]>;
}
