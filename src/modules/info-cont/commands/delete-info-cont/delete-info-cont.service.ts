import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteInfoContCommand } from './delete-info-cont.command';

export type DeleteInfoContCommandResult = Result<
  boolean,
  InfoContNotFoundError
>;

@CommandHandler(DeleteInfoContCommand)
export class DeleteInfoContService implements ICommandHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    protected readonly infoContRepo: InfoContRepositoryPort,
  ) {}

  async execute(
    command: DeleteInfoContCommand,
  ): Promise<DeleteInfoContCommandResult> {
    try {
      const result = await this.infoContRepo.delete({
        id: command.infoContId,
      } as InfoContEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new InfoContNotFoundError(error));
      }

      throw error;
    }
  }
}
