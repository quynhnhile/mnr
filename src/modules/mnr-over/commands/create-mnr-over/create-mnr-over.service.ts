import { Err, Ok, Result } from 'oxide.ts';
import { MNR_OVER_REPOSITORY } from '@modules/mnr-over/mnr-over.di-tokens';
import { MnrOverRepositoryPort } from '@modules/mnr-over/database/mnr-over.repository.port';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMnrOverCommand } from './create-mnr-over.command';
import { MnrOverCodeAlreadyExsitError } from '../../domain/mnr-over.error';

export type CreateMnrOverServiceResult = Result<
  MnrOverEntity,
  MnrOverCodeAlreadyExsitError
>;

@CommandHandler(CreateMnrOverCommand)
export class CreateMnrOverService implements ICommandHandler {
  constructor(
    @Inject(MNR_OVER_REPOSITORY)
    protected readonly mnrOverRepo: MnrOverRepositoryPort,
  ) {}

  async execute(
    command: CreateMnrOverCommand,
  ): Promise<CreateMnrOverServiceResult> {
    const mnrOver = MnrOverEntity.create({
      ...command.getExtendedProps<CreateMnrOverCommand>(),
    });

    try {
      const createdMnrOver = await this.mnrOverRepo.insert(mnrOver);
      return Ok(createdMnrOver);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new MnrOverCodeAlreadyExsitError(error));
      }
      throw error;
    }
  }
}
