import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import { PayerCodeAlreadyExistsError } from '@modules/payer/domain/payer.error';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePayerCommand } from './create-payer.command';

export type CreatePayerCommandResult = Result<
  PayerEntity,
  PayerCodeAlreadyExistsError
>;

@CommandHandler(CreatePayerCommand)
export class CreatePayerService implements ICommandHandler {
  constructor(
    @Inject(PAYER_REPOSITORY)
    protected readonly payerRepo: PayerRepositoryPort,
  ) {}

  async execute(
    command: CreatePayerCommand,
  ): Promise<CreatePayerCommandResult> {
    const payer = PayerEntity.create({
      ...command.getExtendedProps<CreatePayerCommand>(),
    });

    try {
      const createdPayer = await this.payerRepo.insert(payer);
      return Ok(createdPayer);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PayerCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
