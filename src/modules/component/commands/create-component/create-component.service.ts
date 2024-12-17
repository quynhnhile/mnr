import { Err, Ok, Result } from 'oxide.ts';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateComponentCommand } from './create-component.command';
import { ComponentCodeAlreadyExistsError } from '../../domain/component.error';

export type CreateComponentServiceResult = Result<
  ComponentEntity,
  ComponentCodeAlreadyExistsError
>;

@CommandHandler(CreateComponentCommand)
export class CreateComponentService implements ICommandHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    protected readonly componentRepo: ComponentRepositoryPort,
  ) {}

  async execute(
    command: CreateComponentCommand,
  ): Promise<CreateComponentServiceResult> {
    const props = command.getExtendedProps<CreateComponentCommand>();

    const { compCode } = props;

    const [foundCompCode] = await Promise.all([
      this.componentRepo.findOneByCode(compCode),
    ]);

    if (!foundCompCode.isNone()) {
      return Err(new ComponentCodeAlreadyExistsError());
    }

    const component = ComponentEntity.create({
      ...props,
    });

    try {
      const createdComponent = await this.componentRepo.insert(component);
      return Ok(createdComponent);
    } catch (error: any) {
      throw error;
    }
  }
}
