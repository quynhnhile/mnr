import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { VendorTypeRepositoryPort } from '@modules/vendor-type/database/vendor-type.repository.port';
import { VendorTypeEntity } from '@modules/vendor-type/domain/vendor-type.entity';
import { VendorTypeCodeAlreadyExistsError } from '@modules/vendor-type/domain/vendor-type.error';
import { VENDOR_TYPE_REPOSITORY } from '@modules/vendor-type/vendor-type.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVendorTypeCommand } from './create-vendor-type.command';

export type CreateVendorTypeCommandResult = Result<
  VendorTypeEntity,
  VendorTypeCodeAlreadyExistsError
>;

@CommandHandler(CreateVendorTypeCommand)
export class CreateVendorTypeService implements ICommandHandler {
  constructor(
    @Inject(VENDOR_TYPE_REPOSITORY)
    protected readonly vendorTypeRepo: VendorTypeRepositoryPort,
  ) {}

  async execute(
    command: CreateVendorTypeCommand,
  ): Promise<CreateVendorTypeCommandResult> {
    const vendorType = VendorTypeEntity.create({
      ...command.getExtendedProps<CreateVendorTypeCommand>(),
    });

    try {
      const createdVendorType = await this.vendorTypeRepo.insert(vendorType);
      return Ok(createdVendorType);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new VendorTypeCodeAlreadyExistsError(error));
      }

      throw error;
    }
  }
}
