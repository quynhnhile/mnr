import { Err, Ok, Result } from 'oxide.ts';
import { SurveyDetailRepositoryPort } from '@modules/survey/database/survey-detail.repository.port';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyDetailNotFoundError } from '@modules/survey/domain/survey-detail.error';
import { SURVEY_DETAIL_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSurveyDetailCommand } from './update-survey-detail.command';

export type UpdateSurveyDetailServiceResult = Result<
  SurveyDetailEntity,
  SurveyDetailNotFoundError
>;

@CommandHandler(UpdateSurveyDetailCommand)
export class UpdateSurveyDetailService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_DETAIL_REPOSITORY)
    protected readonly surveyDetailRepo: SurveyDetailRepositoryPort,
  ) {}

  async execute(
    command: UpdateSurveyDetailCommand,
  ): Promise<UpdateSurveyDetailServiceResult> {
    const found = await this.surveyDetailRepo.findOneById(
      command.surveyDetailId,
    );
    if (found.isNone()) {
      return Err(new SurveyDetailNotFoundError());
    }

    const surveyDetail = found.unwrap();
    surveyDetail.update({
      ...command.getExtendedProps<UpdateSurveyDetailCommand>(),
    });

    try {
      const updatedSurveyDetail = await this.surveyDetailRepo.update(
        surveyDetail,
      );
      return Ok(updatedSurveyDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
