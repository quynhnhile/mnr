import { Err, Ok, Result } from 'oxide.ts';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorEntity } from '@modules/vendor/domain/vendor.entity';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindVendorQuery {
  vendorId: bigint;

  constructor(public readonly id: bigint) {
    this.vendorId = id;
  }
}
export type FindVendorQueryResult = Result<VendorEntity, VendorNotFoundError>;

@QueryHandler(FindVendorQuery)
export class FindVendorQueryHandler implements IQueryHandler {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    protected readonly vendorRepo: VendorRepositoryPort,
  ) {}

  async execute(query: FindVendorQuery): Promise<FindVendorQueryResult> {
    const found = await this.vendorRepo.findOneById(query.vendorId);
    if (found.isNone()) return Err(new VendorNotFoundError());

    return Ok(found.unwrap());
  }
}
