import { Err, Ok, Result } from 'oxide.ts';
import { DAMAGE_REPOSITORY } from '@modules/damage/damage.di-tokens';
import { DamageRepositoryPort } from '@modules/damage/database/damage.repository.port';
import { DamageEntity } from '@modules/damage/domain/damage.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDamageCommand } from './create-damage.command';
import { DamageCodeAndOperationCodeAlreadyExistError } from '../../domain/damage.error';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { ConflictException } from '@src/libs/exceptions';

export type CreateDamageServiceResult = Result<
  DamageEntity,
  OperationNotFoundError | DamageCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(CreateDamageCommand)
export class CreateDamageService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(DAMAGE_REPOSITORY)
    protected readonly damageRepo: DamageRepositoryPort,
  ) {}

  async execute(
    command: CreateDamageCommand,
  ): Promise<CreateDamageServiceResult> {
    const props = command.getExtendedProps<CreateDamageCommand>();

    const { operationCode, damCode } = props;

    const [foundOperationCode, foundDamCode] = await Promise.all([
      operationCode
        ? this.operationRepo.findOneByCode(operationCode)
        : undefined,
      operationCode
        ? this.damageRepo.findOneByCode(damCode, [operationCode])
        : this.damageRepo.findOneByCode(damCode),
    ]);
    if (operationCode && operationCode != '*' && foundOperationCode?.isNone()) {
      return Err(new OperationNotFoundError());
    }

    if (!foundDamCode.isNone()) {
      return Err(new DamageCodeAndOperationCodeAlreadyExistError());
    }
    const damage = DamageEntity.create(props);

    try {
      const createdDamage = await this.damageRepo.insert(damage);
      return Ok(createdDamage);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new DamageCodeAndOperationCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
