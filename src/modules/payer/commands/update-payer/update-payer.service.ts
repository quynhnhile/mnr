import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import {
  PayerNotFoundError,
  PayerCodeAlreadyExistsError,
  PayerCodeAlreadyInUseError,
} from '@modules/payer/domain/payer.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePayerCommand } from './update-payer.command';

export type UpdatePayerCommandResult = Result<
  PayerEntity,
  PayerNotFoundError | PayerCodeAlreadyInUseError | PayerCodeAlreadyExistsError
>;

@CommandHandler(UpdatePayerCommand)
export class UpdatePayerService implements ICommandHandler {
  constructor(
    @Inject(PAYER_REPOSITORY)
    protected readonly payerRepo: PayerRepositoryPort,
  ) {}

  async execute(
    command: UpdatePayerCommand,
  ): Promise<UpdatePayerCommandResult> {
    const found = await this.payerRepo.findOneByIdWithInUseCount(
      command.payerId,
    );
    if (found.isNone()) {
      return Err(new PayerNotFoundError());
    }

    const payer = found.unwrap();
    const updateResult = payer.update({
      ...command.getExtendedProps<UpdatePayerCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedPayer = await this.payerRepo.update(payer);
      return Ok(updatedPayer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PayerCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
