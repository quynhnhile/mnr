import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { COM_DAM_REP_REPOSITORY } from '@modules/com-dam-rep/com-dam-rep.di-tokens';
import { ComDamRepRepositoryPort } from '@modules/com-dam-rep/database/com-dam-rep.repository.port';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import { ComDamRepNotFoundError } from '@modules/com-dam-rep/domain/com-dam-rep.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteComDamRepCommand } from './delete-com-dam-rep.command';

export type DeleteComDamRepServiceResult = Result<boolean, ComDamRepNotFoundError>;

@CommandHandler(DeleteComDamRepCommand)
export class DeleteComDamRepService implements ICommandHandler {
  constructor(
    @Inject(COM_DAM_REP_REPOSITORY)
    protected readonly comDamRepRepo: ComDamRepRepositoryPort,
  ) {}

  async execute(
    command: DeleteComDamRepCommand,
  ): Promise<DeleteComDamRepServiceResult> {
    try {
      const result = await this.comDamRepRepo.delete({
        id: command.comDamRepId,
      } as ComDamRepEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ComDamRepNotFoundError(error));
      }

      throw error;
    }
  }
}
