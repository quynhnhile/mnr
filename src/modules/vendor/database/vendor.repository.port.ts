import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { VendorEntity } from '../domain/vendor.entity';

export interface VendorRepositoryPort extends RepositoryPort<VendorEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<VendorEntity>>;
  findOneByCode(code: string): Promise<Option<VendorEntity>>;
}
