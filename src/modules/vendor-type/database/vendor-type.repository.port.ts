import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { VendorTypeEntity } from '../domain/vendor-type.entity';

export interface VendorTypeRepositoryPort
  extends RepositoryPort<VendorTypeEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<VendorTypeEntity>>;
}
