import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { LocationEntity } from '../domain/location.entity';

export interface LocationRepositoryPort extends RepositoryPort<LocationEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<LocationEntity>>;
  findOneByCode(code: string): Promise<Option<LocationEntity>>;
  findManyBycodes(codes: string[]): Promise<LocationEntity[]>;
}
