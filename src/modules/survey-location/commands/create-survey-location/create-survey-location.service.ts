import { Ok, Result } from 'oxide.ts';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationEntity } from '@modules/survey-location/domain/survey-location.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSurveyLocationCommand } from './create-survey-location.command';

export type CreateSurveyLocationServiceResult = Result<
  SurveyLocationEntity,
  any
>;

@CommandHandler(CreateSurveyLocationCommand)
export class CreateSurveyLocationService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_LOCATION_REPOSITORY)
    protected readonly surveyLocationRepo: SurveyLocationRepositoryPort,
  ) {}

  async execute(
    command: CreateSurveyLocationCommand,
  ): Promise<CreateSurveyLocationServiceResult> {
    const surveyLocation = SurveyLocationEntity.create({
      ...command.getExtendedProps<CreateSurveyLocationCommand>(),
    });

    try {
      const createdSurveyLocation = await this.surveyLocationRepo.insert(
        surveyLocation,
      );
      return Ok(createdSurveyLocation);
    } catch (error: any) {
      throw error;
    }
  }
}
