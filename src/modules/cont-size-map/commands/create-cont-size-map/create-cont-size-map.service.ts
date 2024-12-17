import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { CONT_SIZE_MAP_REPOSITORY } from '@modules/cont-size-map/cont-size-map.di-tokens';
import { ContSizeMapRepositoryPort } from '@modules/cont-size-map/database/cont-size-map.repository.port';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import { ContSizeMapCodeAlreadyExistsError } from '@modules/cont-size-map/domain/cont-size-map.error';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateContSizeMapCommand } from './create-cont-size-map.command';

export type CreateContSizeMapServiceResult = Result<
  ContSizeMapEntity,
  OperationNotFoundError | ContSizeMapCodeAlreadyExistsError
>;

@CommandHandler(CreateContSizeMapCommand)
export class CreateContSizeMapService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CONT_SIZE_MAP_REPOSITORY)
    protected readonly contSizeMapRepo: ContSizeMapRepositoryPort,
  ) {}

  async execute(
    command: CreateContSizeMapCommand,
  ): Promise<CreateContSizeMapServiceResult> {
    const props = command.getExtendedProps<CreateContSizeMapCommand>();
    const { operationCode } = props;

    // Check if operation exists
    const foundOperation = await this.operationRepo.findOneByCode(
      operationCode,
    );
    if (operationCode != '*' && foundOperation.isNone()) {
      return Err(new OperationNotFoundError());
    }

    const contSizeMap = ContSizeMapEntity.create(props);

    try {
      const createdContSizeMap = await this.contSizeMapRepo.insert(contSizeMap);
      return Ok(createdContSizeMap);
    } catch (error: any) {
      // if (error instanceof ConflictException) {
      //   return Err(new ContSizeMapCodeAlreadyExistsError(error));
      // }

      throw error;
    }
  }
}
