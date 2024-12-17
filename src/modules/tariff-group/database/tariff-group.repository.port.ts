import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { TariffGroupEntity } from '../domain/tariff-group.entity';

export interface TariffGroupRepositoryPort
  extends RepositoryPort<TariffGroupEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<TariffGroupEntity>>;
  findOneByCode(code: string): Promise<Option<TariffGroupEntity>>;
  findManyBycodes(codes: string[]): Promise<TariffGroupEntity[]>;
}
