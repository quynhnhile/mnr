import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinishSurveyCommand } from './finish-survey.command';
import { SURVEY_REPOSITORY } from '../../survey.di-tokens';
import { SurveyRepositoryPort } from '../../database/survey.repository.port';
import { SurveyNotFoundError } from '../../domain/survey.error';
import { SurveyEntity } from '../../domain/survey.entity';

export type FinishSurveyServiceResult = Result<
  SurveyEntity,
  SurveyNotFoundError
>;

@CommandHandler(FinishSurveyCommand)
export class FinishSurveyService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_REPOSITORY)
    protected readonly surveyRepo: SurveyRepositoryPort,
  ) {}

  async execute(
    command: FinishSurveyCommand,
  ): Promise<FinishSurveyServiceResult> {
    const found = await this.surveyRepo.findOneById(command.surveyId);
    if (found.isNone()) {
      return Err(new SurveyNotFoundError());
    }

    const props = command.getExtendedProps<FinishSurveyCommand>();
    const survey = found.unwrap();
    survey.finish(props);

    try {
      const updatedSurvey = await this.surveyRepo.update(survey);
      return Ok(updatedSurvey);
    } catch (error: any) {
      throw error;
    }
  }
}
