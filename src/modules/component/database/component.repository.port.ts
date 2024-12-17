import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { ComponentEntity } from '../domain/component.entity';

export interface ComponentRepositoryPort
  extends RepositoryPort<ComponentEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<ComponentEntity>>;
  findOneByCode(
    code: string,
    operationCodes?: string[],
  ): Promise<Option<ComponentEntity>>;
}
