import { Err, Ok, Result } from 'oxide.ts';
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { SurveyDetailRepositoryPort } from '@modules/survey/database/survey-detail.repository.port';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyDetailEntity } from '@modules/survey/domain/survey-detail.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import {
  SURVEY_DETAIL_REPOSITORY,
  SURVEY_REPOSITORY,
} from '@modules/survey/survey.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSurveyDetailCommand } from './create-survey-detail.command';

export type CreateSurveyDetailServiceResult = Result<
  SurveyDetailEntity,
  SurveyNotFoundError | InfoContNotFoundError
>;

@CommandHandler(CreateSurveyDetailCommand)
export class CreateSurveyDetailService implements ICommandHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    private readonly infoContRepo: InfoContRepositoryPort,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepo: ContainerRepositoryPort,
    @Inject(SURVEY_REPOSITORY)
    private readonly surveyRepo: SurveyRepositoryPort,
    @Inject(SURVEY_DETAIL_REPOSITORY)
    protected readonly surveyDetailRepo: SurveyDetailRepositoryPort,
  ) {}

  async execute(
    command: CreateSurveyDetailCommand,
  ): Promise<CreateSurveyDetailServiceResult> {
    const { idSurvey, ...props } =
      command.getExtendedProps<CreateSurveyDetailCommand>();

    const foundSurvey = await this.surveyRepo.findOneById(idSurvey);
    if (foundSurvey.isNone()) {
      return Err(new SurveyNotFoundError());
    }
    const survey = foundSurvey.unwrap();

    const [foundInfoCont, foundContainer] = await Promise.all([
      this.infoContRepo.findOneByContNo(survey.containerNo),
      this.containerRepo.findOneByIdOrContNo(survey.containerNo),
    ]);
    if (foundContainer.isNone() || foundInfoCont.isNone()) {
      return Err(new InfoContNotFoundError());
    }

    const surveyDetail = SurveyDetailEntity.create({
      ...props,
      containerNo: survey.containerNo,
      idSurvey,
      surveyNo: survey.surveyNo,
    });

    try {
      const createdSurveyDetail = await this.surveyDetailRepo.insert(
        surveyDetail,
      );
      return Ok(createdSurveyDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
