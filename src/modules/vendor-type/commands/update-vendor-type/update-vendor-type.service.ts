import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { VendorTypeRepositoryPort } from '@modules/vendor-type/database/vendor-type.repository.port';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import {
  VendorTypeCodeAlreadyExistsError,
  VendorTypeCodeAlreadyInUseError,
  VendorTypeNotFoundError,
} from '@modules/vendor-type/domain/vendor-type.error';
import { VENDOR_TYPE_REPOSITORY } from '@modules/vendor-type/vendor-type.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVendorTypeCommand } from './update-vendor-type.command';

export type UpdateVendorTypeCommandResult = Result<
  VendorTypeEntity,
  | VendorTypeNotFoundError
  | VendorTypeCodeAlreadyInUseError
  | VendorTypeCodeAlreadyExistsError
>;

@CommandHandler(UpdateVendorTypeCommand)
export class UpdateVendorTypeService implements ICommandHandler {
  constructor(
    @Inject(VENDOR_TYPE_REPOSITORY)
    protected readonly vendorTypeRepo: VendorTypeRepositoryPort,
  ) {}

  async execute(
    command: UpdateVendorTypeCommand,
  ): Promise<UpdateVendorTypeCommandResult> {
    const found = await this.vendorTypeRepo.findOneByIdWithInUseCount(
      command.vendorTypeId,
    );
    if (found.isNone()) {
      return Err(new VendorTypeNotFoundError());
    }

    const vendorType = found.unwrap();
    const updateResult = vendorType.update({
      ...command.getExtendedProps<UpdateVendorTypeCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedVendorType = await this.vendorTypeRepo.update(vendorType);
      return Ok(updatedVendorType);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new VendorTypeCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
