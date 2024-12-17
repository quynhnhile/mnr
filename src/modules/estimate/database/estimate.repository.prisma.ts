import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Estimate as EstimateModel, Prisma } from '@prisma/client';
import { EstimateEntity } from '../domain/estimate.entity';
import { EstimateMapper } from '../mappers/estimate.mapper';
import {
  EstimateFindOneParams,
  EstimateRepositoryPort,
} from './estimate.repository.port';

export const EstimateScalarFieldEnum = Prisma.EstimateScalarFieldEnum;

@Injectable()
export class PrismaEstimateRepository
  extends PrismaMultiTenantRepositoryBase<EstimateEntity, EstimateModel>
  implements EstimateRepositoryPort
{
  protected modelName = 'estimate';

  constructor(private manager: PrismaClientManager, mapper: EstimateMapper) {
    super(manager, mapper);
  }

  async createEstimate(entity: EstimateEntity): Promise<EstimateEntity> {
    const client = await this._getClient();

    const record = this.mapper.toPersistence(entity);
    delete (record as any).id; // remove id

    const result = await client.estimate.create({
      data: record,
      include: { estimateDetails: true },
    });

    return this.mapper.toDomain(result);
  }

  async findOneByNumber(
    params: EstimateFindOneParams,
  ): Promise<Option<EstimateEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.estimate.findFirst({
      where: { ...params },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findOneByIdRef(idRef: bigint): Promise<Option<EstimateEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.estimate.findFirst({
      where: { idRef },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findOneByIdIncludeEstimateDetails(
    id: bigint,
  ): Promise<Option<EstimateEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.estimate.findFirst({
      where: { id },
      include: { estimateDetails: true },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findOneWithStatistics(
    estimateId: bigint,
    includeStatistics?: boolean,
  ): Promise<Option<EstimateEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.estimate.findFirst({
      where: { id: estimateId },
      orderBy: { createdAt: 'desc' },
    });
    if (!result) return None;
    if (!includeStatistics) return Some(this.mapper.toDomain(result));

    const statistics = await this._getEstimateStatistics(estimateId);
    return Some(this.mapper.toDomain({ ...result, ...statistics }));
  }

  private async _getEstimateStatistics(estimateId: bigint): Promise<{
    totalEstimateValue: number;
    estimateDetailCount: number;
    localApprovalEstimateCount: number;
    operationApprovalEstimateCount: number;
    operationRejectedEstimateCount: number;
    rejectedEstimateCount: number;
  }> {
    // Get client by context
    const client = await this._getClient();

    const rawQuery = Prisma.sql`
      SELECT
        COALESCE(SUM(CASE WHEN cancel_date IS NULL THEN total ELSE 0 END), 0)::numeric AS total,
        COUNT(id)::numeric AS total_item,
        COUNT(
          CASE
            WHEN
              local_approval_date IS NOT NULL AND approval_date IS NULL AND cancel_date IS NULL
            THEN 1
            ELSE NULL
          END
        ) AS total_local_approval,
        COUNT(
          CASE 
            WHEN
              approval_date IS NOT NULL AND cancel_date IS NULL
            THEN 1
            ELSE NULL
          END
        ) AS total_operation_approval,
        COUNT(
          CASE
            WHEN cancel_date IS NOT NULL AND is_opr_cancel = TRUE
            THEN 1
            ELSE NULL
          END
        ) AS total_operation_rejected,
        COUNT(
          CASE
            WHEN cancel_date IS NOT NULL AND is_opr_cancel = FALSE
            THEN 1
            ELSE NULL
          END
        ) AS total_rejected
      FROM dt_estimate_detail ed
      WHERE ed.id_estimate = ${estimateId}::bigint
    `;

    const [
      {
        total,
        total_item: totalItem,
        total_local_approval: totalLocalApproval,
        total_operation_approval: totalOperationApproval,
        total_operation_rejected: totalOperationRejected,
        total_rejected: totalRejected,
      },
    ] = await client.$queryRaw<
      Array<{
        total: bigint;
        total_item: bigint;
        total_local_approval: bigint;
        total_operation_approval: bigint;
        total_operation_rejected: bigint;
        total_rejected: bigint;
      }>
    >(rawQuery);

    return {
      totalEstimateValue: +total.toString(),
      estimateDetailCount: +totalItem.toString(),
      localApprovalEstimateCount: +totalLocalApproval.toString(),
      operationApprovalEstimateCount: +totalOperationApproval.toString(),
      operationRejectedEstimateCount: +totalOperationRejected.toString(),
      rejectedEstimateCount: +totalRejected.toString(),
    };
  }
}
