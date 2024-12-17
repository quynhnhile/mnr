import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import {
  ContainerCodeAlreadyExistsError,
  ContainerNotFoundError,
} from '@modules/container/domain/container.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateContainerCommand } from './update-container.command';
import { Validation } from '@src/libs/utils/validation';

export type UpdateContainerCommandResult = Result<
  ContainerEntity,
  ContainerNotFoundError | ContainerCodeAlreadyExistsError
>;

@CommandHandler(UpdateContainerCommand)
export class UpdateContainerService implements ICommandHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
    private readonly validation: Validation,
  ) {}

  async execute(
    command: UpdateContainerCommand,
  ): Promise<UpdateContainerCommandResult> {
    const found = await this.containerRepo.findOneById(command.containerId);
    if (found.isNone()) {
      return Err(new ContainerNotFoundError());
    }
    if (command.containerNo) {
      const containerNo = await this.validation.checkMatchContainerNo(
        command.containerNo,
      );
      if (!containerNo) {
        return Promise.reject(
          new Error(
            'Sai định dạng container_no: 11 ký tự, 4 ký tự đầu là chữ cái in hoa từ A-Z, 7 ký tự sau là số từ 0-9',
          ),
        );
      }
    }

    const container = found.unwrap();
    container.update({
      ...command.getExtendedProps<UpdateContainerCommand>(),
    });

    try {
      const updatedContainer = await this.containerRepo.update(container);
      return Ok(updatedContainer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ContainerCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
