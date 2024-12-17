import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateNotFoundError } from '@modules/estimate/domain/estimate.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEstimateCommand } from './delete-estimate.command';

export type DeleteEstimateServiceResult = Result<
  boolean,
  EstimateNotFoundError
>;

@CommandHandler(DeleteEstimateCommand)
export class DeleteEstimateService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
  ) {}

  async execute(
    command: DeleteEstimateCommand,
  ): Promise<DeleteEstimateServiceResult> {
    try {
      const result = await this.estimateRepo.delete({
        id: command.estimateId,
      } as EstimateEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new EstimateNotFoundError(error));
      }

      throw error;
    }
  }
}
