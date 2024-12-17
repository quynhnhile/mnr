import { Err, Ok, Result } from 'oxide.ts';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import {
  ClassifyCodeAlreadyExsitError,
  ClassifyNotFoundError,
  ClassifyCodeAlreadyInUseError,
} from '@modules/classify/domain/classify.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClassifyCommand } from './update-classify.command';
import { ConflictException } from '@src/libs/exceptions';

export type UpdateClassifyServiceResult = Result<
  ClassifyEntity,
  | ClassifyNotFoundError
  | ClassifyCodeAlreadyInUseError
  | ClassifyCodeAlreadyExsitError
>;

@CommandHandler(UpdateClassifyCommand)
export class UpdateClassifyService implements ICommandHandler {
  constructor(
    @Inject(CLASSIFY_REPOSITORY)
    protected readonly classifyRepo: ClassifyRepositoryPort,
  ) {}

  async execute(
    command: UpdateClassifyCommand,
  ): Promise<UpdateClassifyServiceResult> {
    const found = await this.classifyRepo.findOneByIdWithInUseCount(
      command.classifyId,
    );
    if (found.isNone()) {
      return Err(new ClassifyNotFoundError());
    }

    const classify = found.unwrap();
    const updateResult = classify.update({
      ...command.getExtendedProps<UpdateClassifyCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedClassify = await this.classifyRepo.update(classify);
      return Ok(updatedClassify);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ClassifyCodeAlreadyExsitError(error));
      }
      throw error;
    }
  }
}
