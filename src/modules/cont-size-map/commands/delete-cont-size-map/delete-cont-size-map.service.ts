import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CONT_SIZE_MAP_REPOSITORY } from '@modules/cont-size-map/cont-size-map.di-tokens';
import { ContSizeMapRepositoryPort } from '@modules/cont-size-map/database/cont-size-map.repository.port';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import { ContSizeMapNotFoundError } from '@modules/cont-size-map/domain/cont-size-map.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteContSizeMapCommand } from './delete-cont-size-map.command';

export type DeleteContSizeMapCommandResult = Result<
  boolean,
  ContSizeMapNotFoundError
>;

@CommandHandler(DeleteContSizeMapCommand)
export class DeleteContSizeMapService implements ICommandHandler {
  constructor(
    @Inject(CONT_SIZE_MAP_REPOSITORY)
    protected readonly contSizeMapRepo: ContSizeMapRepositoryPort,
  ) {}

  async execute(
    command: DeleteContSizeMapCommand,
  ): Promise<DeleteContSizeMapCommandResult> {
    try {
      const result = await this.contSizeMapRepo.delete({
        id: command.contSizeMapId,
      } as ContSizeMapEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ContSizeMapNotFoundError(error));
      }

      throw error;
    }
  }
}
