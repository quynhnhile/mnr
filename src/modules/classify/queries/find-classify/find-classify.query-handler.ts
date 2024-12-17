import { Err, Ok, Result } from 'oxide.ts';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import { ClassifyNotFoundError } from '@modules/classify/domain/classify.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindClassifyQuery {
  classifyId: bigint;

  constructor(public readonly id: bigint) {
    this.classifyId = id;
  }
}

export type FindClassifyQueryResult = Result<
  ClassifyEntity,
  ClassifyNotFoundError
>;

@QueryHandler(FindClassifyQuery)
export class FindClassifyQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLASSIFY_REPOSITORY)
    protected readonly classifyRepo: ClassifyRepositoryPort,
  ) {}

  async execute(query: FindClassifyQuery): Promise<FindClassifyQueryResult> {
    const found = await this.classifyRepo.findOneById(query.classifyId);
    if (found.isNone()) return Err(new ClassifyNotFoundError());

    return Ok(found.unwrap());
  }
}
