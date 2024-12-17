import { RepositoryPort } from '@libs/ddd';
import { DamageLocalEntity } from '../domain/damage-local.entity';

export type DamageLocalRepositoryPort = RepositoryPort<DamageLocalEntity>;
