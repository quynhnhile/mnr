import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorEntity } from '@modules/vendor/domain/vendor.entity';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindVendorsQuery extends PrismaPaginatedQueryBase<Prisma.VendorWhereInput> {}

export type FindVendorsQueryResult = Result<Paginated<VendorEntity>, void>;

@QueryHandler(FindVendorsQuery)
export class FindVendorsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    protected readonly vendorRepo: VendorRepositoryPort,
  ) {}

  async execute(query: FindVendorsQuery): Promise<FindVendorsQueryResult> {
    const result = await this.vendorRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
