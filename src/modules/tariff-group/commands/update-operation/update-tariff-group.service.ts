import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import {
  TariffGroupCodeAlreadyExistError,
  TariffGroupCodeAlreadyInUseError,
  TariffGroupNotFoundError,
} from '@modules/tariff-group/domain/tariff-group.error';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOperationCommand } from './update-tariff-group.command';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';

export type UpdateOperaionServiceResult = Result<
  TariffGroupEntity,
  | TariffGroupNotFoundError
  | OperationNotFoundError
  | TariffGroupCodeAlreadyInUseError
  | TariffGroupCodeAlreadyExistError
>;

@CommandHandler(UpdateOperationCommand)
export class UpdateOperationService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(TARIFF_GROUP_REPOSITORY)
    protected readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async execute(
    command: UpdateOperationCommand,
  ): Promise<UpdateOperaionServiceResult> {
    // Check if tariff group exist
    const found = await this.tariffGroupRepo.findOneByIdWithInUseCount(
      command.tariffGroupId,
    );
    if (found.isNone()) {
      return Err(new TariffGroupNotFoundError());
    }

    const tariffGroup = found.unwrap();
    const props = command.getExtendedProps<UpdateOperationCommand>();

    // Check if operation and vendor exist
    const { operationCode } = props;
    const [foundOperations] = await Promise.all([
      operationCode
        ? this.operationRepo.findManyByCodes(operationCode)
        : Promise.resolve([]),
    ]);
    if (
      operationCode &&
      !operationCode.includes('*') &&
      foundOperations?.length !== operationCode.length
    ) {
      return Err(new OperationNotFoundError());
    }
    const updateResult = tariffGroup.update(props);
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedTariffGroup = await this.tariffGroupRepo.update(tariffGroup);
      return Ok(updatedTariffGroup);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TariffGroupCodeAlreadyExistError());
      }

      throw error;
    }
  }
}
