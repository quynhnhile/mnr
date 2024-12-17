import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSurveyLocationCommand } from './delete-survey-location.command';

export type DeleteSurveyLocationServiceResult = Result<
  boolean,
  SurveyLocationNotFoundError
>;

@CommandHandler(DeleteSurveyLocationCommand)
export class DeleteSurveyLocationService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_LOCATION_REPOSITORY)
    protected readonly surveyLocationRepo: SurveyLocationRepositoryPort,
  ) {}

  async execute(
    command: DeleteSurveyLocationCommand,
  ): Promise<DeleteSurveyLocationServiceResult> {
    try {
      const result = await this.surveyLocationRepo.delete({
        id: command.surveyLocationId,
      } as SurveyLocationEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new SurveyLocationNotFoundError(error));
      }

      throw error;
    }
  }
}
