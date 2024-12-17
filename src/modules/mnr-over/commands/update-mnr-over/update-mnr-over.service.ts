import { Err, Ok, Result } from 'oxide.ts';
import { MNR_OVER_REPOSITORY } from '@modules/mnr-over/mnr-over.di-tokens';
import { MnrOverRepositoryPort } from '@modules/mnr-over/database/mnr-over.repository.port';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import {
  MnrOverCodeAlreadyExsitError,
  MnrOverNotFoundError,
} from '@modules/mnr-over/domain/mnr-over.error';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMnrOverCommand } from './update-mnr-over.command';

export type UpdateMnrOverServiceResult = Result<
  MnrOverEntity,
  MnrOverNotFoundError | MnrOverCodeAlreadyExsitError
>;

@CommandHandler(UpdateMnrOverCommand)
export class UpdateMnrOverService implements ICommandHandler {
  constructor(
    @Inject(MNR_OVER_REPOSITORY)
    protected readonly mnrOverRepo: MnrOverRepositoryPort,
  ) {}

  async execute(
    command: UpdateMnrOverCommand,
  ): Promise<UpdateMnrOverServiceResult> {
    const found = await this.mnrOverRepo.findOneById(command.mnrOverId);
    if (found.isNone()) {
      return Err(new MnrOverNotFoundError());
    }

    const mnrOver = found.unwrap();
    mnrOver.update({
      ...command.getExtendedProps<UpdateMnrOverCommand>(),
    });

    try {
      const updatedMnrOver = await this.mnrOverRepo.update(mnrOver);
      return Ok(updatedMnrOver);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new MnrOverCodeAlreadyExsitError());
      }
      throw error;
    }
  }
}
