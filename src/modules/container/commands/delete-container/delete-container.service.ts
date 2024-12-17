import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { ContainerNotFoundError } from '@modules/container/domain/container.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteContainerCommand } from './delete-container.command';

export type DeleteContainerCommandResult = Result<
  boolean,
  ContainerNotFoundError
>;

@CommandHandler(DeleteContainerCommand)
export class DeleteContainerService implements ICommandHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
  ) {}

  async execute(
    command: DeleteContainerCommand,
  ): Promise<DeleteContainerCommandResult> {
    try {
      const result = await this.containerRepo.delete({
        id: command.containerId,
      } as ContainerEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ContainerNotFoundError(error));
      }

      throw error;
    }
  }
}
