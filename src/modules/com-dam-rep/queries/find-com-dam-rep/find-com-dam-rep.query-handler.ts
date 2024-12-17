import { Err, Ok, Result } from 'oxide.ts';
import { COM_DAM_REP_REPOSITORY } from '@modules/com-dam-rep/com-dam-rep.di-tokens';
import { ComDamRepRepositoryPort } from '@modules/com-dam-rep/database/com-dam-rep.repository.port';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import { ComDamRepNotFoundError } from '@modules/com-dam-rep/domain/com-dam-rep.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindComDamRepQuery {
  comDamRepId: bigint;

  constructor(public readonly id: bigint) {
    this.comDamRepId = id;
  }
}

export type FindComDamRepQueryResult = Result<ComDamRepEntity, ComDamRepNotFoundError>;

@QueryHandler(FindComDamRepQuery)
export class FindComDamRepQueryHandler implements IQueryHandler {
  constructor(
    @Inject(COM_DAM_REP_REPOSITORY)
    protected readonly comDamRepRepo: ComDamRepRepositoryPort
  ) {}

  async execute(query: FindComDamRepQuery): Promise<FindComDamRepQueryResult> {
    const found = await this.comDamRepRepo.findOneById(query.comDamRepId);
    if (found.isNone()) return Err(new ComDamRepNotFoundError());

    return Ok(found.unwrap());
  }
}
