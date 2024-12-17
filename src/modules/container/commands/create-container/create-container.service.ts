import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { ContainerCodeAlreadyExistsError } from '@modules/container/domain/container.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateContainerCommand } from './create-container.command';
import { Validation } from '@src/libs/utils/validation';

export type CreateContainerCommandResult = Result<
  ContainerEntity,
  ContainerCodeAlreadyExistsError
>;

@CommandHandler(CreateContainerCommand)
export class CreateContainerService implements ICommandHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
    private readonly validation: Validation,
  ) {}

  async execute(
    command: CreateContainerCommand,
  ): Promise<CreateContainerCommandResult> {
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
    const container = ContainerEntity.create({
      ...command.getExtendedProps<CreateContainerCommand>(),
    });

    try {
      const createdContainer = await this.containerRepo.insert(container);
      return Ok(createdContainer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ContainerCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
