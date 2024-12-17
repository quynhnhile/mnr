import { Err, Ok, Result } from 'oxide.ts';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailEntity } from '@modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLocalDmgDetailCommand } from './create-local-dmg-detail.command';
import { SURVEY_REPOSITORY } from '@src/modules/survey/survey.di-tokens';
import { SurveyRepositoryPort } from '@src/modules/survey/database/survey.repository.port';
import { SurveyNotFoundError } from '@src/modules/survey/domain/survey.error';

export type CreateLocalDmgDetailServiceResult = Result<
  LocalDmgDetailEntity,
  SurveyNotFoundError
>;

@CommandHandler(CreateLocalDmgDetailCommand)
export class CreateLocalDmgDetailService implements ICommandHandler {
  constructor(
    @Inject(SURVEY_REPOSITORY)
    private readonly surveyRepo: SurveyRepositoryPort,
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    protected readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
  ) {}

  async execute(
    command: CreateLocalDmgDetailCommand,
  ): Promise<CreateLocalDmgDetailServiceResult> {
    const [foundSurvey] = await Promise.all([
      this.surveyRepo.findOneById(command.idSurvey),
    ]);

    if (foundSurvey.isNone()) {
      return Err(new SurveyNotFoundError());
    }

    const survey = foundSurvey.unwrap();

    const localDmgDetail = LocalDmgDetailEntity.create({
      ...command.getExtendedProps<CreateLocalDmgDetailCommand>(),
      idCont: survey.idCont,
    });

    try {
      const createdLocalDmgDetail = await this.localDmgDetailRepo.insert(
        localDmgDetail,
      );
      return Ok(createdLocalDmgDetail);
    } catch (error: any) {
      throw error;
    }
  }
}
