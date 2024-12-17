import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { GroupLocationLocalEntity } from '../domain/group-location-local.entity';

export interface GroupLocationLocalRepositoryPort
  extends RepositoryPort<GroupLocationLocalEntity> {
  findOneByIdWithInUseCount(
    id: bigint,
  ): Promise<Option<GroupLocationLocalEntity>>;
}
