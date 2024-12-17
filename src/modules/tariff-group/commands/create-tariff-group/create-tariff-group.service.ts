import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TariffGroupCodeAlreadyExistError } from '@modules/tariff-group/domain/tariff-group.error';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTariffGroupCommand } from './create-tariff-group.command';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';

export type CreateTariffGroupServiceResult = Result<
  TariffGroupEntity,
  | OperationNotFoundError
  | VendorNotFoundError
  | TariffGroupCodeAlreadyExistError
>;

@CommandHandler(CreateTariffGroupCommand)
export class CreateTariffGroupService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(TARIFF_GROUP_REPOSITORY)
    protected readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async execute(
    command: CreateTariffGroupCommand,
  ): Promise<CreateTariffGroupServiceResult> {
    const props = command.getExtendedProps<CreateTariffGroupCommand>();

    // Check if operation and vendor exist
    const { operationCode, vendorCode } = props;
    const [foundOperations, foundVendor] = await Promise.all([
      operationCode
        ? this.operationRepo.findManyByCodes(operationCode)
        : Promise.resolve([]),
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
    ]);
    if (
      operationCode &&
      !operationCode.includes('*') &&
      foundOperations?.length !== operationCode.length
    ) {
      return Err(new OperationNotFoundError());
    }
    if (vendorCode && foundVendor?.isNone()) {
      return Err(new VendorNotFoundError());
    }

    const tariffGroup = TariffGroupEntity.create(props);

    try {
      const createdTariffGroup = await this.tariffGroupRepo.insert(tariffGroup);
      return Ok(createdTariffGroup);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TariffGroupCodeAlreadyExistError(error));
      }

      throw error;
    }
  }
}
