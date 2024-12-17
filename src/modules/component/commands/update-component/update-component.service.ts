import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import {
  ComponentCodeAlreadyExistsError,
  ComponentCodeAlreadyInUseError,
  ComponentNotFoundError,
} from '@modules/component/domain/component.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateComponentCommand } from './update-component.command';

export type UpdateComponentServiceResult = Result<
  ComponentEntity,
  | ComponentNotFoundError
  | ComponentCodeAlreadyInUseError
  | ComponentCodeAlreadyExistsError
>;

@CommandHandler(UpdateComponentCommand)
export class UpdateComponentService implements ICommandHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    protected readonly componentRepo: ComponentRepositoryPort,
  ) {}

  async execute(
    command: UpdateComponentCommand,
  ): Promise<UpdateComponentServiceResult> {
    const found = await this.componentRepo.findOneByIdWithInUseCount(
      command.componentId,
    );
    if (found.isNone()) {
      return Err(new ComponentNotFoundError());
    }

    const component = found.unwrap();
    const updateResult = component.update({
      ...command.getExtendedProps<UpdateComponentCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedComponent = await this.componentRepo.update(component);
      return Ok(updatedComponent);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ComponentCodeAlreadyExistsError());
      }

      throw error;
    }
  }
}
