import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { TerminalEntity } from '../domain/terminal.entity';

export interface TerminalRepositoryPort extends RepositoryPort<TerminalEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<TerminalEntity>>;
}
