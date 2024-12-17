import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorEntity } from '@modules/vendor/domain/vendor.entity';
import { VendorCodeAlreadyExistsError } from '@modules/vendor/domain/vendor.error';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVendorCommand } from './create-vendor.command';

export type CreateVendorCommandResult = Result<
  VendorEntity,
  OperationNotFoundError | VendorCodeAlreadyExistsError
>;

@CommandHandler(CreateVendorCommand)
export class CreateVendorService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    protected readonly vendorRepo: VendorRepositoryPort,
  ) {}

  async execute(
    command: CreateVendorCommand,
  ): Promise<CreateVendorCommandResult> {
    const props = command.getExtendedProps<CreateVendorCommand>();
    const { operationCode } = props;

    // Check if the operation exists
    if (operationCode) {
      const foundOperation = await this.operationRepo.findOneByCode(
        operationCode,
      );
      if (operationCode != '*' && foundOperation.isNone())
        return Err(new OperationNotFoundError());
    }

    const vendor = VendorEntity.create(props);

    try {
      const createdVendor = await this.vendorRepo.insert(vendor);
      return Ok(createdVendor);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new VendorCodeAlreadyExistsError(error));
      }

      throw error;
    }
  }
}
