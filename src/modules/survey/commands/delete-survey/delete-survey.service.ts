import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { SURVEY_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSurveyCommand } from './delete-survey.command';

export type DeleteSurveyServiceResult = Result<boolean, SurveyNotFoundError>;

@CommandHandler(DeleteSurveyCommand)
export class DeleteSurveyService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_REPOSITORY)
    protected readonly surveyRepo: SurveyRepositoryPort,
  ) {}

  async execute(
    command: DeleteSurveyCommand,
  ): Promise<DeleteSurveyServiceResult> {
    try {
      const result = await this.surveyRepo.delete({
        id: command.surveyId,
      } as SurveyEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new SurveyNotFoundError(error));
      }

      throw error;
    }
  }
}
