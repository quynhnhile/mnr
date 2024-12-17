import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { ContainerEntity } from '../domain/container.entity';

export interface ContainerRepositoryPort
  extends RepositoryPort<ContainerEntity> {
  findOneByIdOrContNo(idOrContNo: string): Promise<Option<ContainerEntity>>;
}
