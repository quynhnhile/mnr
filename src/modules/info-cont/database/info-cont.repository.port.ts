import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { InfoContEntity } from '../domain/info-cont.entity';

export interface InfoContRepositoryPort extends RepositoryPort<InfoContEntity> {
  findOneByContNo(containerNo: string): Promise<Option<InfoContEntity>>;
}
