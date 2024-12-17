import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { VENDOR_TYPE_REPOSITORY } from '@modules/vendor-type/vendor-type.di-tokens';
import { VendorTypeRepositoryPort } from '@modules/vendor-type/database/vendor-type.repository.port';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import {
  VendorTypeCodeAlreadyInUseError,
  VendorTypeNotFoundError,
} from '@modules/vendor-type/domain/vendor-type.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVendorTypeCommand } from './delete-vendor-type.command';

export type DeleteVendorTypeCommandResult = Result<
  boolean,
  VendorTypeNotFoundError | VendorTypeCodeAlreadyInUseError
>;

@CommandHandler(DeleteVendorTypeCommand)
export class DeleteVendorTypeService implements ICommandHandler {
  constructor(
    @Inject(VENDOR_TYPE_REPOSITORY)
    protected readonly vendorTypeRepo: VendorTypeRepositoryPort,
  ) {}

  async execute(
    command: DeleteVendorTypeCommand,
  ): Promise<DeleteVendorTypeCommandResult> {
    const found = await this.vendorTypeRepo.findOneByIdWithInUseCount(
      command.vendorTypeId,
    );
    if (found.isNone()) {
      return Err(new VendorTypeNotFoundError());
    }

    const vendorType = found.unwrap();
    const deleteResult = vendorType.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.vendorTypeRepo.delete({
        id: command.vendorTypeId,
      } as VendorTypeEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new VendorTypeNotFoundError(error));
      }

      throw error;
    }
  }
}
