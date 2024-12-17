import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import {
  ClassifyNotFoundError,
  ClassifyCodeAlreadyInUseError,
} from '@modules/classify/domain/classify.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteClassifyCommand } from './delete-classify.command';

export type DeleteClassifyServiceResult = Result<
  boolean,
  ClassifyNotFoundError | ClassifyCodeAlreadyInUseError
>;

@CommandHandler(DeleteClassifyCommand)
export class DeleteClassifyService implements ICommandHandler {
  constructor(
    @Inject(CLASSIFY_REPOSITORY)
    protected readonly classifyRepo: ClassifyRepositoryPort,
  ) {}

  async execute(
    command: DeleteClassifyCommand,
  ): Promise<DeleteClassifyServiceResult> {
    const found = await this.classifyRepo.findOneByIdWithInUseCount(
      command.classifyId,
    );
    if (found.isNone()) {
      return Err(new ClassifyNotFoundError());
    }

    const classify = found.unwrap();
    const deleteResult = classify.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.classifyRepo.delete(classify);
      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ClassifyNotFoundError(error));
      }

      throw error;
    }
  }
}
