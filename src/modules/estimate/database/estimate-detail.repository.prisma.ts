import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { Injectable } from '@nestjs/common';
import { EstimateDetail as EstimateDetailModel, Prisma } from '@prisma/client';
import { Paginated, PrismaPaginatedQueryParams } from '@src/libs/ddd';
import { EstimateDetailMapper } from '../mappers/estimate-detail.mapper';
import { EstimateDetailRepositoryPort } from './estimate-detail.repository.port';

export const EstimateDetailScalarFieldEnum =
  Prisma.EstimateDetailScalarFieldEnum;

@Injectable()
export class PrismaEstimateDetailRepository
  extends PrismaMultiTenantRepositoryBase<
    EstimateDetailEntity,
    EstimateDetailModel
  >
  implements EstimateDetailRepositoryPort
{
  protected modelName = 'estimateDetail';

  constructor(
    private manager: PrismaClientManager,
    mapper: EstimateDetailMapper,
  ) {
    super(manager, mapper);
  }

  async getOneById(id: bigint): Promise<Option<EstimateDetailEntity>> {
    const client = await this._getClient();

    const result = await client.estimateDetail.findFirst({
      where: { id },
      include: {
        jobRepairCleans: true,
      },
    });

    return result ? Some(this.mapper.toDomain(result)) : None;
  }

  async findAllEstimateDetails(
    params: Prisma.EstimateDetailFindManyArgs,
  ): Promise<EstimateDetailEntity[]> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.estimateDetail.findMany(params);
    return result.map(this.mapper.toDomain);
  }

  async findAllEstimateDetailsIncludeJob(
    params: PrismaPaginatedQueryParams<Prisma.EstimateDetailWhereInput>,
  ): Promise<Paginated<EstimateDetailEntity>> {
    const client = await this._getClient();

    const { limit, offset, page, where = {}, orderBy } = params;

    const [data, count] = await Promise.all([
      client.estimateDetail.findMany({
        skip: offset,
        take: limit,
        where,
        include: { jobRepairCleans: true },
        orderBy,
      }),
      client.estimateDetail.count({ where: { ...where } }),
    ]);
    return new Paginated({
      data: data.map((item) => {
        return this.mapper.toDomain({
          ...item,
        });
      }),
      count,
      limit,
      page,
    });
  }

  async findAllEstimateDetailsStartableIncludeJob(
    params: PrismaPaginatedQueryParams<Prisma.EstimateDetailWhereInput>,
  ): Promise<Paginated<EstimateDetailEntity>> {
    const client = await this._getClient();

    const { limit, offset, page, where = {}, orderBy } = params;

    const [data, count] = await Promise.all([
      client.estimateDetail.findMany({
        skip: offset,
        take: limit,
        where: {
          ...where,
          cancelDate: null,
          approvalDate: null,
          reqActiveDate: null,
        },
        include: { jobRepairCleans: true },
        orderBy,
      }),
      client.estimateDetail.count({ where: { ...where } }),
    ]);

    return new Paginated({
      data: data.map((item) => {
        return this.mapper.toDomain({
          ...item,
        });
      }),
      count,
      limit,
      page,
    });
  }
}
