import { RepositoryPort } from '@libs/ddd';
import { LocalDmgDetailEntity } from '../domain/local-dmg-detail.entity';

export interface LocalDmgDetailRepositoryPort
  extends RepositoryPort<LocalDmgDetailEntity> {
  createLocalDmgDetail(
    entity: LocalDmgDetailEntity,
  ): Promise<LocalDmgDetailEntity>;
}
