import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodEntity } from '@modules/clean-method/domain/clean-method.entity';
import { Inject } from '@nestjs/common';
import { ConflictException } from '@libs/exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCleanMethodCommand } from './create-clean-method.command';
import { CleanMethodCodeAndOperationCodeAlreadyExistError } from '../../domain/clean-method.error';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';

export type CreateCleanMethodServiceResult = Result<
  CleanMethodEntity,
  OperationNotFoundError | CleanMethodCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(CreateCleanMethodCommand)
export class CreateCleanMethodService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CLEAN_METHOD_REPOSITORY)
    protected readonly cleanMethodRepo: CleanMethodRepositoryPort,
  ) {}

  async execute(
    command: CreateCleanMethodCommand,
  ): Promise<CreateCleanMethodServiceResult> {
    const props = command.getExtendedProps<CreateCleanMethodCommand>();

    const { operationCode, cleanMethodCode } = props;

    const [foundOperationCode, foundCleanMethodCode] = await Promise.all([
      this.operationRepo.findOneByCode(operationCode),
      this.cleanMethodRepo.findOneByCode(cleanMethodCode, operationCode),
    ]);

    if (operationCode != '*' && foundOperationCode.isNone()) {
      return Err(new OperationNotFoundError());
    }

    if (!foundCleanMethodCode.isNone()) {
      return Err(new CleanMethodCodeAndOperationCodeAlreadyExistError());
    }

    const cleanMethod = CleanMethodEntity.create(props);

    try {
      const createdCleanMethod = await this.cleanMethodRepo.insert(cleanMethod);
      return Ok(createdCleanMethod);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CleanMethodCodeAndOperationCodeAlreadyExistError(error));
      }
      throw error;
    }
  }
}
