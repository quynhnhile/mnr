import { RepositoryPort } from '@libs/ddd';
import { SymbolEntity } from '../domain/symbol.entity';
import { Option } from 'oxide.ts';

export interface SymbolRepositoryPort extends RepositoryPort<SymbolEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<SymbolEntity>>;
}
