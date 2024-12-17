import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateClassifyCommand } from './create-classify.command';
import { ClassifyCodeAlreadyExsitError } from '../../domain/classify.error';

export type CreateClassifyServiceResult = Result<
  ClassifyEntity,
  ClassifyCodeAlreadyExsitError
>;

@CommandHandler(CreateClassifyCommand)
export class CreateClassifyService implements ICommandHandler {
  constructor(
    @Inject(CLASSIFY_REPOSITORY)
    protected readonly classifyRepo: ClassifyRepositoryPort,
  ) {}

  async execute(
    command: CreateClassifyCommand,
  ): Promise<CreateClassifyServiceResult> {
    const classify = ClassifyEntity.create({
      ...command.getExtendedProps<CreateClassifyCommand>(),
    });

    try {
      const createdClassify = await this.classifyRepo.insert(classify);
      return Ok(createdClassify);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ClassifyCodeAlreadyExsitError(error));
      }
      throw error;
    }
  }
}
