import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { MNR_OVER_REPOSITORY } from '@modules/mnr-over/mnr-over.di-tokens';
import { MnrOverRepositoryPort } from '@modules/mnr-over/database/mnr-over.repository.port';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import { MnrOverNotFoundError } from '@modules/mnr-over/domain/mnr-over.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMnrOverCommand } from './delete-mnr-over.command';

export type DeleteMnrOverServiceResult = Result<boolean, MnrOverNotFoundError>;

@CommandHandler(DeleteMnrOverCommand)
export class DeleteMnrOverService implements ICommandHandler {
  constructor(
    @Inject(MNR_OVER_REPOSITORY)
    protected readonly mnrOverRepo: MnrOverRepositoryPort,
  ) {}

  async execute(
    command: DeleteMnrOverCommand,
  ): Promise<DeleteMnrOverServiceResult> {
    const found = await this.mnrOverRepo.findOneById(command.mnrOverId);
    if (found.isNone()) {
      return Err(new MnrOverNotFoundError());
    }

    const mnrOver = found.unwrap();
    mnrOver.delete();
    try {
      const result = await this.mnrOverRepo.delete({
        id: command.mnrOverId,
      } as MnrOverEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new MnrOverNotFoundError(error));
      }

      throw error;
    }
  }
}
