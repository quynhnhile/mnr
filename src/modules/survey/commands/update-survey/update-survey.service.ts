import { Err, Ok, Result } from 'oxide.ts';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import { ClassifyNotFoundError } from '@modules/classify/domain/classify.error';
import { CLEAN_METHOD_REPOSITORY } from '@modules/clean-method/clean-method.di-tokens';
import { CleanMethodRepositoryPort } from '@modules/clean-method/database/clean-method.repository.port';
import { CleanMethodNotFoundError } from '@modules/clean-method/domain/clean-method.error';
import { CLEAN_MODE_REPOSITORY } from '@modules/clean-mode/clean-mode.di-tokens';
import { CleanModeRepositoryPort } from '@modules/clean-mode/database/clean-mode.repository.port';
import { CleanModeNotFoundError } from '@modules/clean-mode/domain/clean-mode.error';
import { CONDITION_REPOSITORY } from '@modules/condition/condition.di-tokens';
import { ConditionRepositoryPort } from '@modules/condition/database/condition.repository.port';
import { ConditionNotFoundError } from '@modules/condition/domain/condition.error';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContNotFoundError } from '@modules/info-cont/domain/info-cont.error';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { SURVEY_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSurveyCommand } from './update-survey.command';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '@src/modules/estimate/estimate.di-tokens';
import { EstimateRepositoryPort } from '@src/modules/estimate/database/estimate.repository.port';
import { EstimateNotFoundError } from '@src/modules/estimate/domain/estimate.error';
import { SurveyService } from '../../services/survey.service';
import { EstimateService } from '@src/modules/estimate/services/estimate.service';
import { EstimateDetailRepositoryPort } from '@src/modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailEntity } from '@src/modules/estimate/domain/estimate-detail.entity';
import { EstimateDetailNotFoundError } from '@src/modules/estimate/domain/estimate-detail.error';
import { LocalDmgDetailEntity } from '@src/modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@src/modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@src/modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { LocalDmgDetailNotFoundError } from '@src/modules/local-dmg-detail/domain/local-dmg-detail.error';

export type UpdateSurveyServiceResult = Result<
  SurveyEntity,
  | SurveyNotFoundError
  | InfoContNotFoundError
  | SurveyLocationNotFoundError
  | ConditionNotFoundError
  | ClassifyNotFoundError
  | CleanMethodNotFoundError
  | CleanModeNotFoundError
  | VendorNotFoundError
  | EstimateNotFoundError
  | EstimateDetailNotFoundError
  | LocalDmgDetailNotFoundError
>;

@CommandHandler(UpdateSurveyCommand)
export class UpdateSurveyService implements ICommandHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    private readonly infoContRepo: InfoContRepositoryPort,
    @Inject(SURVEY_LOCATION_REPOSITORY)
    private readonly surveyLocationRepo: SurveyLocationRepositoryPort,
    @Inject(CONDITION_REPOSITORY)
    private readonly conditionRepo: ConditionRepositoryPort,
    @Inject(CLASSIFY_REPOSITORY)
    private readonly classifyRepo: ClassifyRepositoryPort,
    @Inject(CLEAN_METHOD_REPOSITORY)
    private readonly cleanMethodRepo: CleanMethodRepositoryPort,
    @Inject(CLEAN_MODE_REPOSITORY)
    private readonly cleanModeRepo: CleanModeRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(SURVEY_REPOSITORY)
    protected readonly surveyRepo: SurveyRepositoryPort,
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    private readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
    private readonly surveyService: SurveyService,
    private readonly estimateService: EstimateService,
  ) {}

  async execute(
    command: UpdateSurveyCommand,
  ): Promise<UpdateSurveyServiceResult> {
    const found = await this.surveyRepo.findOneById(command.surveyId);
    if (found.isNone()) {
      return Err(new SurveyNotFoundError());
    }

    const props = command.getExtendedProps<UpdateSurveyCommand>();
    const {
      surveyLocationCode,
      conditionCode,
      conditionMachineCode,
      classifyCode,
      cleanMethodCode,
      cleanModeCode,
      vendorCode,
      isTankInside,
      preSurveyNo,
      isRevice,
      altSurveyNo,
      localDmgDetails = [],
      estimate,
    } = props;

    const [
      foundSurveyLocation,
      foundCondition,
      foundConditionMachine,
      foundClassify,
      foundCleanMethod,
      foundCleanMode,
      foundVendor,
      foundPreSurvey,
      foundAltSurvey,
      foundEstimate,
    ] = await Promise.all([
      surveyLocationCode
        ? this.surveyLocationRepo.findOneByCode(surveyLocationCode)
        : Promise.resolve(null),
      conditionCode
        ? this.conditionRepo.findOneByCode({
            code: conditionCode,
            isMachine: false,
          })
        : Promise.resolve(null),
      conditionMachineCode
        ? this.conditionRepo.findOneByCode({
            code: conditionMachineCode,
            isMachine: true,
          })
        : Promise.resolve(null),
      classifyCode
        ? this.classifyRepo.findOneByCode(classifyCode)
        : Promise.resolve(null),
      cleanMethodCode
        ? this.cleanMethodRepo.findOneByCode(cleanMethodCode)
        : Promise.resolve(null),
      cleanModeCode
        ? this.cleanModeRepo.findOneByCode(cleanModeCode)
        : Promise.resolve(null),
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
      isTankInside && preSurveyNo
        ? this.surveyRepo.findOneBySurveyNo({ surveyNo: preSurveyNo })
        : Promise.resolve(null),
      isRevice && altSurveyNo
        ? this.surveyRepo.findOneBySurveyNo({ surveyNo: altSurveyNo })
        : Promise.resolve(null),
      estimate
        ? this.estimateRepo.findOneById(BigInt(estimate.id))
        : Promise.resolve(null),
    ]);

    if (surveyLocationCode && foundSurveyLocation?.isNone()) {
      return Err(new SurveyLocationNotFoundError());
    }
    if (conditionCode && foundCondition?.isNone()) {
      return Err(new ConditionNotFoundError());
    }
    if (conditionMachineCode && foundConditionMachine?.isNone()) {
      return Err(new ConditionNotFoundError());
    }
    if (classifyCode && foundClassify?.isNone()) {
      return Err(new ClassifyNotFoundError());
    }
    if (cleanMethodCode && foundCleanMethod?.isNone()) {
      return Err(new CleanMethodNotFoundError());
    }
    if (cleanModeCode && foundCleanMode?.isNone()) {
      return Err(new CleanModeNotFoundError());
    }
    if (vendorCode && foundVendor?.isNone()) {
      return Err(new VendorNotFoundError());
    }
    if (isTankInside && preSurveyNo && foundPreSurvey?.isNone()) {
      return Err(new SurveyNotFoundError());
    }
    if (isRevice && altSurveyNo && foundAltSurvey?.isNone()) {
      return Err(new SurveyNotFoundError());
    }
    if (estimate && foundEstimate?.isNone()) {
      return Err(new EstimateNotFoundError());
    }

    const estimateEntity = foundEstimate?.unwrap();

    let estimateDetailUpdate;
    let estimateDetailCreate;

    const details = estimate?.estimateDetails ?? [];

    if (details.length > 0) {
      estimateDetailCreate = estimate?.estimateDetails.filter(
        (item) => !item.id,
      );
      estimateDetailUpdate = estimate?.estimateDetails.filter(
        (item) => item.id,
      );
    }

    if (estimateDetailCreate != undefined && estimateDetailCreate.length > 0) {
      if (estimateEntity) {
        let estimateDetailEntity: EstimateDetailEntity;
        estimateDetailCreate.forEach(async (detail) => {
          estimateDetailEntity = EstimateDetailEntity.create({
            compCode: detail.compCode,
            idEstimate: estimateEntity.id,
            estimateNo: estimateEntity.estimateNo,
            repCode: detail.repCode,
            length: detail.length,
            width: detail.width,
            quantity: detail.quantity,
            payerCode: detail.payerCode,
            symbolCode: detail.symbolCode,
            rate: detail.rate,
            isClean: await this.surveyService.getIsClean(detail.repCode),
            createdBy: props.updatedBy,
          });
          await this.estimateService.calculateTariff(
            estimateDetailEntity,
            detail.operationCode,
          );

          try {
            const createdEstimateDetail = await this.estimateDetailRepo.insert(
              estimateDetailEntity,
            );
            return Ok(createdEstimateDetail);
          } catch (error: any) {
            throw error;
          }
        });
      }
    }

    if (estimateDetailUpdate != undefined && estimateDetailUpdate.length > 0) {
      if (estimateEntity) {
        for (const detail of estimateDetailUpdate) {
          const foundEstimateDetail = await this.estimateDetailRepo.findOneById(
            BigInt(detail.id),
          );
          if (foundEstimateDetail.isNone()) {
            return Err(new EstimateDetailNotFoundError());
          }

          const estimateDetail = foundEstimateDetail.unwrap();
          estimateDetail.update({
            ...detail,
            idEstimate: estimateEntity.id,
            estimateNo: estimateEntity.estimateNo,
          });

          await this.estimateService.calculateTariff(
            estimateDetail,
            detail.operationCode,
          );

          try {
            await this.estimateDetailRepo.update(estimateDetail);
          } catch (error: any) {
            throw error;
          }
        }
      }
    }

    const survey = found.unwrap();
    survey.update(props);

    const localDmgDetailCreate = localDmgDetails.filter((item) => !item.id);
    const localDmgDetailUpdate = localDmgDetails.filter((item) => item.id);

    if (localDmgDetailCreate != undefined && localDmgDetailCreate.length > 0) {
      let localDmgDetailEntity: LocalDmgDetailEntity;
      localDmgDetailCreate.forEach(async (item) => {
        localDmgDetailEntity = LocalDmgDetailEntity.create({
          idSurvey: survey.id,
          idCont: survey.idCont,
          damLocalCode: item.damLocalCode ?? '',
          locLocalCode: item.locLocalCode ?? '',
          symbolCode: item.symbolCode ?? '',
          size: item.size ?? '',
          createdBy: props.updatedBy,
        });

        try {
          await this.localDmgDetailRepo.insert(localDmgDetailEntity);
        } catch (error: any) {
          throw error;
        }
      });
    }

    if (localDmgDetailUpdate != undefined && localDmgDetailUpdate.length > 0) {
      for (const detail of localDmgDetailUpdate) {
        const foundLocal = await this.localDmgDetailRepo.findOneById(
          BigInt(detail.id as number),
        );
        if (foundLocal.isNone()) {
          return Err(new LocalDmgDetailNotFoundError());
        }
        const localDmgDetail = foundLocal.unwrap();
        localDmgDetail.update({
          ...detail,
          idSurvey: survey.id,
          idCont: survey.idCont,
        });

        try {
          console.log(localDmgDetail);
          await this.localDmgDetailRepo.update(localDmgDetail);
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }
    }
    try {
      const updatedSurvey = await this.surveyRepo.update(survey);
      return Ok(updatedSurvey);
    } catch (error: any) {
      throw error;
    }
  }
}
