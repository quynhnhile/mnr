import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { CONT_SIZE_MAP_REPOSITORY } from '@modules/cont-size-map/cont-size-map.di-tokens';
import { ContSizeMapRepositoryPort } from '@modules/cont-size-map/database/cont-size-map.repository.port';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import {
  ContSizeMapCodeAlreadyExistsError,
  ContSizeMapNotFoundError,
} from '@modules/cont-size-map/domain/cont-size-map.error';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationNotFoundError } from '@modules/operation/domain/operation.error';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateContSizeMapCommand } from './update-cont-size-map.command';

export type UpdateContSizeMapCommandResult = Result<
  ContSizeMapEntity,
  | ContSizeMapNotFoundError
  | OperationNotFoundError
  | ContSizeMapCodeAlreadyExistsError
>;

@CommandHandler(UpdateContSizeMapCommand)
export class UpdateContSizeMapService implements ICommandHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private readonly operationRepo: OperationRepositoryPort,
    @Inject(CONT_SIZE_MAP_REPOSITORY)
    protected readonly contSizeMapRepo: ContSizeMapRepositoryPort,
  ) {}

  async execute(
    command: UpdateContSizeMapCommand,
  ): Promise<UpdateContSizeMapCommandResult> {
    const found = await this.contSizeMapRepo.findOneById(command.contSizeMapId);
    if (found.isNone()) {
      return Err(new ContSizeMapNotFoundError());
    }

    const props = command.getExtendedProps<UpdateContSizeMapCommand>();
    const { operationCode } = props;

    // Check if operation exists
    if (operationCode) {
      const foundOperation = await this.operationRepo.findOneByCode(
        operationCode,
      );
      if (operationCode != '*' && foundOperation.isNone()) {
        return Err(new OperationNotFoundError());
      }
    }

    const contSizeMap = found.unwrap();
    contSizeMap.update(props);

    try {
      const updatedContSizeMap = await this.contSizeMapRepo.update(contSizeMap);
      return Ok(updatedContSizeMap);
    } catch (error: any) {
      // if (error instanceof ConflictException) {
      //   return Err(new ContSizeMapCodeAlreadyExistsError(error));
      // }
      throw error;
    }
  }
}
