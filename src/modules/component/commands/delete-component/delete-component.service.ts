import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import {
  ComponentCodeAlreadyInUseError,
  ComponentNotFoundError,
} from '@modules/component/domain/component.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteComponentCommand } from './delete-component.command';

export type DeleteComponentServiceResult = Result<
  boolean,
  ComponentNotFoundError | ComponentCodeAlreadyInUseError
>;

@CommandHandler(DeleteComponentCommand)
export class DeleteComponentService implements ICommandHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    protected readonly componentRepo: ComponentRepositoryPort,
  ) {}

  async execute(
    command: DeleteComponentCommand,
  ): Promise<DeleteComponentServiceResult> {
    const found = await this.componentRepo.findOneByIdWithInUseCount(
      command.componentId,
    );
    if (found.isNone()) {
      return Err(new ComponentNotFoundError());
    }

    const component = found.unwrap();
    const deleteResult = component.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.componentRepo.delete(component);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ComponentNotFoundError(error));
      }

      throw error;
    }
  }
}
