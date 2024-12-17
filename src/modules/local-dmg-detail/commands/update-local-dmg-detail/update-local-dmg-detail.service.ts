import { Err, Ok, Result } from 'oxide.ts';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LocalDmgDetailNotFoundError } from '@modules/local-dmg-detail/domain/local-dmg-detail.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLocalDmgDetailCommand } from './update-local-dmg-detail.command';

export type UpdateLocalDmgDetailServiceResult = Result<
  LocalDmgDetailEntity,
  LocalDmgDetailNotFoundError
>;

@CommandHandler(UpdateLocalDmgDetailCommand)
export class UpdateLocalDmgDetailService implements ICommandHandler {
  constructor(
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    protected readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
  ) {}

  async execute(
    command: UpdateLocalDmgDetailCommand,
  ): Promise<UpdateLocalDmgDetailServiceResult> {
    const found = await this.localDmgDetailRepo.findOneById(
      command.localDmgDetailId,
    );
    if (found.isNone()) {
      return Err(new LocalDmgDetailNotFoundError());
    }

    const localDmgDetail = found.unwrap();
    localDmgDetail.update({
      ...command.getExtendedProps<UpdateLocalDmgDetailCommand>(),
    });

    try {
      const updatedLocalDmgDetail = await this.localDmgDetailRepo.update(
        localDmgDetail,
      );
      return Ok(updatedLocalDmgDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
