import { Err, Ok, Result } from 'oxide.ts';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { ContainerNotFoundError } from '@modules/container/domain/container.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindContainerQuery {
  containerId: bigint;

  constructor(public readonly id: bigint) {
    this.containerId = id;
  }
}

export type FindContainerQueryResult = Result<
  ContainerEntity,
  ContainerNotFoundError
>;

@QueryHandler(FindContainerQuery)
export class FindContainerQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
  ) {}

  async execute(query: FindContainerQuery): Promise<FindContainerQueryResult> {
    const found = await this.containerRepo.findOneById(query.containerId);
    if (found.isNone()) return Err(new ContainerNotFoundError());

    return Ok(found.unwrap());
  }
}
