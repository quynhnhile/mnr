import { Option } from 'oxide.ts';
import {
  Paginated,
  PrismaPaginatedQueryParams,
  RepositoryPort,
} from '@libs/ddd';
import { Prisma } from '@prisma/client';
import { EstimateDetailEntity } from '../domain/estimate-detail.entity';

export interface EstimateDetailRepositoryPort
  extends RepositoryPort<EstimateDetailEntity> {
  getOneById(id: bigint): Promise<Option<EstimateDetailEntity>>;
  findAllEstimateDetails(
    params: Prisma.EstimateDetailFindManyArgs,
  ): Promise<EstimateDetailEntity[]>;
  findAllEstimateDetailsIncludeJob(
    params: PrismaPaginatedQueryParams<Prisma.EstimateDetailWhereInput>,
  ): Promise<Paginated<EstimateDetailEntity>>;
  findAllEstimateDetailsStartableIncludeJob(
    params: PrismaPaginatedQueryParams<Prisma.EstimateDetailWhereInput>,
  ): Promise<Paginated<EstimateDetailEntity>>;
}
