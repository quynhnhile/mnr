import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { SurveyDetailRepositoryPort } from '@modules/survey/database/survey-detail.repository.port';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyDetailNotFoundError } from '@modules/survey/domain/survey-detail.error';
import { SURVEY_DETAIL_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSurveyDetailCommand } from './delete-survey-detail.command';

export type DeleteSurveyDetailServiceResult = Result<
  boolean,
  SurveyDetailNotFoundError
>;

@CommandHandler(DeleteSurveyDetailCommand)
export class DeleteSurveyDetailService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_DETAIL_REPOSITORY)
    protected readonly surveyDetailRepo: SurveyDetailRepositoryPort,
  ) {}

  async execute(
    command: DeleteSurveyDetailCommand,
  ): Promise<DeleteSurveyDetailServiceResult> {
    try {
      const result = await this.surveyDetailRepo.delete({
        id: command.surveyDetailId,
      } as SurveyDetailEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new SurveyDetailNotFoundError(error));
      }

      throw error;
    }
  }
}
