import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { PayerEntity } from '../domain/payer.entity';

export interface PayerRepositoryPort extends RepositoryPort<PayerEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<PayerEntity>>;
  findOneByCode(code: string): Promise<Option<PayerEntity>>;
}
