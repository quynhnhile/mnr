import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { EstimateEntity } from '../domain/estimate.entity';

export interface EstimateFindOneParams {
  estimateNo: string;
  idRef?: bigint;
}

export interface EstimateRepositoryPort extends RepositoryPort<EstimateEntity> {
  createEstimate(entity: EstimateEntity): Promise<EstimateEntity>;
  findOneByNumber(
    params: EstimateFindOneParams,
  ): Promise<Option<EstimateEntity>>;
  findOneWithStatistics(
    estimateId: bigint,
    includeStatistics?: boolean,
  ): Promise<Option<EstimateEntity>>;
  findOneByIdRef(idRef: bigint): Promise<Option<EstimateEntity>>;
  findOneByIdIncludeEstimateDetails(
    id: bigint,
  ): Promise<Option<EstimateEntity>>;
}
