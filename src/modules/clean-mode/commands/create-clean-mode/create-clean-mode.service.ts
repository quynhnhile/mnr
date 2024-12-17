import { Err, Ok, Result } from 'oxide.ts';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeEntity } from '@modules/clean-mode/domain/clean-mode.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCleanModeCommand } from './create-clean-mode.command';
import { ConflictException } from '@src/libs/exceptions';
import { CleanModeCodeAndOperationCodeAlreadyExistError } from '../../domain/clean-mode.error';
import { OperationNotFoundError } from '@src/modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@src/modules/operation/operation.di-tokens';
import { OperationRepositoryPort } from '@src/modules/operation/database/operation.repository.port';

export type CreateCleanModeServiceResult = Result<
  CleanModeEntity,
  OperationNotFoundError | CleanModeCodeAndOperationCodeAlreadyExistError
>;

@CommandHandler(CreateCleanModeCommand)
export class CreateCleanModeService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CLEAN_MODE_REPOSITORY)
    protected readonly cleanModeRepo: CleanModeRepositoryPort,
  ) {}

  async execute(
    command: CreateCleanModeCommand,
  ): Promise<CreateCleanModeServiceResult> {
    const props = command.getExtendedProps<CreateCleanModeCommand>();

    const { operationCode, cleanModeCode } = props;

    const [foundOperationCode, foundCleanModeCode, foundOpr] =
      await Promise.all([
        this.operationRepo.findOneByCode(operationCode),
        this.cleanModeRepo.findOneByCode(cleanModeCode, operationCode),
        this.cleanModeRepo.findOneByCode(operationCode),
      ]);

    if (operationCode != '*' && foundOperationCode.isNone()) {
      return Err(new OperationNotFoundError());
    }

    if (!foundCleanModeCode.isNone()) {
      return Err(new CleanModeCodeAndOperationCodeAlreadyExistError());
    }
    const cleanMode = CleanModeEntity.create(props);

    try {
      const createdCleanMode = await this.cleanModeRepo.insert(cleanMode);
      return Ok(createdCleanMode);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CleanModeCodeAndOperationCodeAlreadyExistError());
      }
      throw error;
    }
  }
}
