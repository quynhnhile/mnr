import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { RegionEntity } from '../domain/region.entity';

export interface RegionRepositoryPort extends RepositoryPort<RegionEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<RegionEntity>>;
}
