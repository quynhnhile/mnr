import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import {
  PayerCodeAlreadyInUseError,
  PayerNotFoundError,
} from '@modules/payer/domain/payer.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePayerCommand } from './delete-payer.command';

export type DeletePayerCommandResult = Result<
  boolean,
  PayerNotFoundError | PayerCodeAlreadyInUseError
>;

@CommandHandler(DeletePayerCommand)
export class DeletePayerService implements ICommandHandler {
  constructor(
    @Inject(PAYER_REPOSITORY)
    protected readonly payerRepo: PayerRepositoryPort,
  ) {}

  async execute(
    command: DeletePayerCommand,
  ): Promise<DeletePayerCommandResult> {
    const found = await this.payerRepo.findOneByIdWithInUseCount(
      command.payerId,
    );
    if (found.isNone()) {
      return Err(new PayerNotFoundError());
    }

    const payer = found.unwrap();
    const deleteResult = payer.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.payerRepo.delete(payer);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new PayerNotFoundError(error));
      }

      throw error;
    }
  }
}
