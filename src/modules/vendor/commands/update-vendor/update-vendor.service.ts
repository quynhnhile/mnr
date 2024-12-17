import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorEntity } from '@modules/vendor/domain/vendor.entity';
import {
  VendorCodeAlreadyExistsError,
  VendorCodeAlreadyInUseError,
  VendorNotFoundError,
} from '@modules/vendor/domain/vendor.error';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVendorCommand } from './update-vendor.command';

export type UpdateVendorCommandResult = Result<
  VendorEntity,
  | VendorNotFoundError
  | OperationNotFoundError
  | VendorCodeAlreadyInUseError
  | VendorCodeAlreadyExistsError
>;

@CommandHandler(UpdateVendorCommand)
export class UpdateVendorService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    protected readonly vendorRepo: VendorRepositoryPort,
  ) {}

  async execute(
    command: UpdateVendorCommand,
  ): Promise<UpdateVendorCommandResult> {
    const found = await this.vendorRepo.findOneByIdWithInUseCount(
      command.vendorId,
    );
    if (found.isNone()) {
      return Err(new VendorNotFoundError());
    }

    const props = command.getExtendedProps<UpdateVendorCommand>();
    const { operationCode } = props;

    if (operationCode) {
      const foundOperation = await this.operationRepo.findOneByCode(
        operationCode,
      );
      if (operationCode != '*' && foundOperation.isNone()) {
        return Err(new OperationNotFoundError());
      }
    }

    const vendor = found.unwrap();
    const updateResult = vendor.update(props);
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedVendor = await this.vendorRepo.update(vendor);
      return Ok(updatedVendor);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new VendorCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
