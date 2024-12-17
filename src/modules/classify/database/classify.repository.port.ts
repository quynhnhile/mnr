import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { ClassifyEntity } from '../domain/classify.entity';

export interface ClassifyRepositoryPort extends RepositoryPort<ClassifyEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<ClassifyEntity>>;
  findOneByCode(
    code: string,
    operationCode?: string,
  ): Promise<Option<ClassifyEntity>>;
}
