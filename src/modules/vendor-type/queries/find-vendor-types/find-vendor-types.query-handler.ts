import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { VendorTypeRepositoryPort } from '@modules/vendor-type/database/vendor-type.repository.port';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import { VENDOR_TYPE_REPOSITORY } from '@modules/vendor-type/vendor-type.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindVendorTypesQuery extends PrismaPaginatedQueryBase<Prisma.VendorTypeWhereInput> {}

export type FindVendorTypesQueryResult = Result<
  Paginated<VendorTypeEntity>,
  void
>;

@QueryHandler(FindVendorTypesQuery)
export class FindVendorTypesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(VENDOR_TYPE_REPOSITORY)
    protected readonly vendorTypeRepo: VendorTypeRepositoryPort,
  ) {}

  async execute(
    query: FindVendorTypesQuery,
  ): Promise<FindVendorTypesQueryResult> {
    const result = await this.vendorTypeRepo.findAllPaginated(query);

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
