import { Err, Ok, Result } from 'oxide.ts';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSurveyLocationCommand } from './update-survey-location.command';

export type UpdateSurveyLocationServiceResult = Result<
  SurveyLocationEntity,
  SurveyLocationNotFoundError
>;

@CommandHandler(UpdateSurveyLocationCommand)
export class UpdateSurveyLocationService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_LOCATION_REPOSITORY)
    protected readonly surveyLocationRepo: SurveyLocationRepositoryPort,
  ) {}

  async execute(
    command: UpdateSurveyLocationCommand,
  ): Promise<UpdateSurveyLocationServiceResult> {
    const found = await this.surveyLocationRepo.findOneById(
      command.surveyLocationId,
    );
    if (found.isNone()) {
      return Err(new SurveyLocationNotFoundError());
    }

    const surveyLocation = found.unwrap();
    surveyLocation.update({
      ...command.getExtendedProps<UpdateSurveyLocationCommand>(),
    });

    try {
      const updatedSurveyLocation = await this.surveyLocationRepo.update(
        surveyLocation,
      );
      return Ok(updatedSurveyLocation);
    } catch (error: any) {
      throw error;
    }
  }
}
