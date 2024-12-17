import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteLocalDmgDetailCommand } from './delete-local-dmg-detail.command';

export type DeleteLocalDmgDetailServiceResult = Result<boolean, LocalDmgDetailNotFoundError>;

@CommandHandler(DeleteLocalDmgDetailCommand)
export class DeleteLocalDmgDetailService implements ICommandHandler {
  constructor(
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    protected readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
  ) {}

  async execute(
    command: DeleteLocalDmgDetailCommand,
  ): Promise<DeleteLocalDmgDetailServiceResult> {
    try {
      const result = await this.localDmgDetailRepo.delete({
        id: command.localDmgDetailId,
      } as LocalDmgDetailEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new LocalDmgDetailNotFoundError(error));
      }

      throw error;
    }
  }
}
