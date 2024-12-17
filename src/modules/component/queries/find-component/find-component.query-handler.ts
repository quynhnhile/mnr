import { Err, Ok, Result } from 'oxide.ts';
import { COMPONENT_REPOSITORY } from '@modules/component/component.di-tokens';
import { ComponentRepositoryPort } from '@modules/component/database/component.repository.port';
import { ComponentEntity } from '@modules/component/domain/component.entity';
import { ComponentNotFoundError } from '@modules/component/domain/component.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindComponentQuery {
  componentId: bigint;

  constructor(public readonly id: bigint) {
    this.componentId = id;
  }
}

export type FindComponentQueryResult = Result<
  ComponentEntity,
  ComponentNotFoundError
>;

@QueryHandler(FindComponentQuery)
export class FindComponentQueryHandler implements IQueryHandler {
  constructor(
    @Inject(COMPONENT_REPOSITORY)
    protected readonly componentRepo: ComponentRepositoryPort,
  ) {}

  async execute(query: FindComponentQuery): Promise<FindComponentQueryResult> {
    const found = await this.componentRepo.findOneById(query.componentId);
    if (found.isNone()) return Err(new ComponentNotFoundError());

    return Ok(found.unwrap());
  }
}
