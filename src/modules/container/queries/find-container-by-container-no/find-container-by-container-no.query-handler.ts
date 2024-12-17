import { Err, Ok, Result } from 'oxide.ts';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { ContainerEntity } from '@modules/container/domain/container.entity';
import { ContainerNotFoundError } from '@modules/container/domain/container.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindContainerByContainerNoQuery {
  constructor(public readonly containerNo: string) {
    this.containerNo = containerNo;
  }
}

export type FindContainerByContainerNoQueryResult = Result<
  ContainerEntity,
  ContainerNotFoundError
>;

@QueryHandler(FindContainerByContainerNoQuery)
export class FindRepairContByContainerNoQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
  ) {}

  async execute(
    query: FindContainerByContainerNoQuery,
  ): Promise<FindContainerByContainerNoQueryResult> {
    const found = await this.containerRepo.findOneByIdOrContNo(
      query.containerNo,
    );
    if (found.isNone()) return Err(new ContainerNotFoundError());

    return Ok(found.unwrap());
  }
}
