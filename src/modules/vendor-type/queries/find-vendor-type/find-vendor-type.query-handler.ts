import { Err, Ok, Result } from 'oxide.ts';
import { VENDOR_TYPE_REPOSITORY } from '@modules/vendor-type/vendor-type.di-tokens';
import { VendorTypeRepositoryPort } from '@modules/vendor-type/database/vendor-type.repository.port';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import { VendorTypeNotFoundError } from '@modules/vendor-type/domain/vendor-type.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindVendorTypeQuery {
  vendorTypeId: bigint;

  constructor(public readonly id: bigint) {
    this.vendorTypeId = id;
  }
}

export type FindVendorTypeQueryResult = Result<
  VendorTypeEntity,
  VendorTypeNotFoundError
>;

@QueryHandler(FindVendorTypeQuery)
export class FindVendorTypeQueryHandler implements IQueryHandler {
  constructor(
    @Inject(VENDOR_TYPE_REPOSITORY)
    protected readonly vendorTypeRepo: VendorTypeRepositoryPort,
  ) {}

  async execute(
    query: FindVendorTypeQuery,
  ): Promise<FindVendorTypeQueryResult> {
    const found = await this.vendorTypeRepo.findOneById(query.vendorTypeId);
    if (found.isNone()) return Err(new VendorTypeNotFoundError());

    return Ok(found.unwrap());
  }
}
