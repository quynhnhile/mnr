import { RepositoryPort } from '@libs/ddd';
import { TariffEntity } from '../domain/tariff.entity';

export type TariffRepositoryPort = RepositoryPort<TariffEntity>;
