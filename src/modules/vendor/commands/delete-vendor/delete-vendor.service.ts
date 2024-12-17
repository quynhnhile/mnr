import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import {
  VendorNotFoundError,
  VendorCodeAlreadyInUseError,
} from '@modules/vendor/domain/vendor.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVendorCommand } from './delete-vendor.command';

export type DeleteVendorCommandResult = Result<
  boolean,
  VendorNotFoundError | VendorCodeAlreadyInUseError
>;

@CommandHandler(DeleteVendorCommand)
export class DeleteVendorService implements ICommandHandler {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    protected readonly vendorRepo: VendorRepositoryPort,
  ) {}

  async execute(
    command: DeleteVendorCommand,
  ): Promise<DeleteVendorCommandResult> {
    const found = await this.vendorRepo.findOneByIdWithInUseCount(
      command.vendorId,
    );
    if (found.isNone()) {
      return Err(new VendorNotFoundError());
    }

    const vendor = found.unwrap();
    const deleteResult = vendor.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.vendorRepo.delete(vendor);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new VendorNotFoundError(error));
      }

      throw error;
    }
  }
}
