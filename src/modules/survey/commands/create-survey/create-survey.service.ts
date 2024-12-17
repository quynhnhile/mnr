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
import { CONTAINER_REPOSITORY } from '@modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@modules/container/database/container.repository.port';
import { EstimateRepositoryPort } from '@modules/estimate/database/estimate.repository.port';
import { EstimateEntity } from '@modules/estimate/domain/estimate.entity';
import { EstimateStatus } from '@modules/estimate/domain/estimate.type';
import { EstimateDetailCreatedUpdatedDomainEvent } from '@modules/estimate/domain/events/estimate-detail-created.domain-event';
import { ESTIMATE_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { ContType } from '@modules/info-cont/domain/info-cont.type';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { SurveyLocationRepositoryPort } from '@modules/survey-location/database/survey-location.repository.port';
import { SurveyLocationNotFoundError } from '@modules/survey-location/domain/survey-location.error';
import { SURVEY_LOCATION_REPOSITORY } from '@modules/survey-location/survey-location.di-tokens';
import { SurveyRepositoryPort } from '@modules/survey/database/survey.repository.port';
import { SurveyEntity } from '@modules/survey/domain/survey.entity';
import { SurveyNotFoundError } from '@modules/survey/domain/survey.error';
import { SurveyInOut } from '@modules/survey/domain/survey.type';
import { SURVEY_REPOSITORY } from '@modules/survey/survey.di-tokens';
import { VendorRepositoryPort } from '@modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@modules/vendor/domain/vendor.error';
import { VENDOR_REPOSITORY } from '@modules/vendor/vendor.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateSurveyCommand } from './create-survey.command';
import { EstimateService } from '../../../estimate/services/estimate.service';
import { SurveyService } from '../../services/survey.service';
import { ContainerNotFoundError } from '@src/modules/container/domain/container.error';
import { Validation } from '@src/libs/utils/validation';
import { LocalDmgDetailEntity } from '@src/modules/local-dmg-detail/domain/local-dmg-detail.entity';
import { LOCAL_DMG_DETAIL_REPOSITORY } from '@src/modules/local-dmg-detail/local-dmg-detail.di-tokens';
import { LocalDmgDetailRepositoryPort } from '@src/modules/local-dmg-detail/database/local-dmg-detail.repository.port';
import { InfoContEntity } from '@src/modules/info-cont/domain/info-cont.entity';

export type CreateSurveyServiceResult = Result<
  SurveyEntity,
  | ContainerNotFoundError
  | SurveyLocationNotFoundError
  | ConditionNotFoundError
  | ClassifyNotFoundError
  | CleanMethodNotFoundError
  | CleanModeNotFoundError
  | VendorNotFoundError
  | RepairContNotFoundError
  | SurveyNotFoundError
>;

@CommandHandler(CreateSurveyCommand)
export class CreateSurveyService implements ICommandHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    private readonly infoContRepo: InfoContRepositoryPort,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepo: ContainerRepositoryPort,
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
    private readonly surveyRepo: SurveyRepositoryPort,
    @Inject(LOCAL_DMG_DETAIL_REPOSITORY)
    private readonly localDmgDetailRepo: LocalDmgDetailRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    private readonly repairContRepo: RepairContRepositoryPort,
    @Inject(ESTIMATE_REPOSITORY)
    private readonly estimateRepo: EstimateRepositoryPort,
    protected readonly eventEmitter: EventEmitter2,
    private readonly estimateService: EstimateService,
    private readonly surveyService: SurveyService,
    private readonly validation: Validation,
  ) {}

  async execute(
    command: CreateSurveyCommand,
  ): Promise<CreateSurveyServiceResult> {
    const props = command.getExtendedProps<CreateSurveyCommand>();
    const checkContainerNo = await this.validation.checkMatchContainerNo(
      command.containerNo,
    );
    if (!checkContainerNo) {
      return Promise.reject(
        new Error(
          'Sai định dạng container_no: 11 ký tự, 4 ký tự đầu là chữ cái in hoa từ A-Z, 7 ký tự sau là số từ 0-9',
        ),
      );
    }
    const {
      containerNo,
      surveyLocationCode,
      conditionCode,
      //conditionMachineCode,
      classifyCode,
      cleanMethodCode,
      cleanModeCode,
      vendorCode,
      idCheck,
      checkNo,
      isTankInside,
      preSurveyNo,
      isRevice,
      altSurveyNo,
      surveyDetails = [],
      localDmgDetails = [],
      isInOut,
    } = props;

    const [
      foundInfoCont,
      foundContainer,
      foundSurveyLocation,
      foundCondition,
      //foundConditionMachine,
      foundClassify,
      foundCleanMethod,
      foundCleanMode,
      foundVendor,
      foundPreSurvey,
      foundAltSurvey,
    ] = await Promise.all([
      this.infoContRepo.findOneByContNo(containerNo),
      this.containerRepo.findOneByIdOrContNo(containerNo),
      this.surveyLocationRepo.findOneByCode(surveyLocationCode),
      conditionCode
        ? this.conditionRepo.findOneByCode({
            code: conditionCode,
            isMachine: false,
          })
        : Promise.resolve(null),
      // conditionMachineCode
      //   ? this.conditionRepo.findOneByCode({
      //       code: conditionMachineCode,
      //       isMachine: true,
      //     })
      //   : Promise.resolve(null),
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
        ? this.surveyRepo.findOneBySurveyNo({
            surveyNo: preSurveyNo,
            containerNo,
            isTankOutside: true,
            isTankInside: false,
          })
        : Promise.resolve(null),
      isRevice && altSurveyNo
        ? this.surveyRepo.findOneBySurveyNo({
            surveyNo: altSurveyNo,
            containerNo,
          })
        : Promise.resolve(null),
    ]);

    if (foundContainer.isNone()) {
      return Err(new ContainerNotFoundError());
    }
    if (foundSurveyLocation.isNone()) {
      return Err(new SurveyLocationNotFoundError());
    }
    if (conditionCode && (!foundCondition || foundCondition?.isNone())) {
      return Err(new ConditionNotFoundError());
    }
    // if (
    //   conditionMachineCode &&
    //   (!foundConditionMachine || foundConditionMachine?.isNone())
    // ) {
    //   return Err(new ConditionNotFoundError());
    // }
    if (classifyCode && (!foundClassify || foundClassify?.isNone())) {
      return Err(new ClassifyNotFoundError());
    }
    if (cleanMethodCode && (!foundCleanMethod || foundCleanMethod?.isNone())) {
      return Err(new CleanMethodNotFoundError());
    }
    if (cleanModeCode && (!foundCleanMode || foundCleanMode?.isNone())) {
      return Err(new CleanModeNotFoundError());
    }
    if (vendorCode && foundVendor?.isNone()) {
      return Err(new VendorNotFoundError());
    }
    if (isRevice && altSurveyNo && foundAltSurvey?.isNone()) {
      return Err(new SurveyNotFoundError());
    }

    let infoCont = !foundInfoCont.isNone() ? foundInfoCont.unwrap() : null;
    let isAddNew = false;
    const container = foundContainer.unwrap();
    // if container is TANK, additional check on idCheck and checkNo
    if (infoCont && infoCont.contType === ContType.TANK) {
      // validate idCheck and checkNo
      console.log({ idCheck, checkNo });

      // if isTankInside, validate preSurveyNo
      if (
        isTankInside &&
        (!preSurveyNo || !foundPreSurvey || foundPreSurvey?.isNone())
      ) {
        return Err(new SurveyNotFoundError());
      }
    }
    const prefixSurvey = 'S';
    const surveyNo = await this.surveyService.generateSurveyNo(prefixSurvey);
    const surveyDate = new Date();

    const { estimate: estimateProps, ...restProps } = props;

    const survey = SurveyEntity.create({
      ...restProps,
      idRep: BigInt(0),
      idCont: container.idCont as string,
      isTankOutside:
        props.isTankInside !== undefined ? props.isTankOutside : false,
      isTankInside:
        props.isTankInside !== undefined ? props.isTankInside : false,
      surveyNo,
      surveyDate,
      createdBy: props.createdBy,
      surveyDetails: surveyDetails.map((detail) => ({
        ...detail,
        idCont: container.idCont as string,
        containerNo: container.containerNo,
        surveyNo,
        surveyDate,
        surveyBy: props.surveyBy,
        createdBy: props.createdBy,
      })),
    });

    if (infoCont) {
      isAddNew = false;
      infoCont.update({
        contAge: survey.contAge,
        machineAge: survey.machineAge,
        machineBrand: survey.machineBrand,
        machineModel: survey.machineModel,
        updatedBy: props.createdBy,
      });
    } else {
      let contType = '';
      if (
        container.localSizeType.substring(2) == '30' &&
        container.isoSizeType.substring(2, 3) == 'R'
      ) {
        contType = 'RF';
      } else if (
        container.localSizeType.substring(2) == '70' &&
        container.isoSizeType.substring(2, 3) == 'TK'
      ) {
        contType = 'RF';
      } else {
        contType = 'DC';
      }
      isAddNew = true;
      infoCont = InfoContEntity.create({
        containerNo: container.containerNo,
        operationCode: container.operationCode,
        localSizeType: container.localSizeType,
        isoSizeType: container.isoSizeType,
        contAge: survey.contAge ?? '',
        machineAge: survey.machineAge,
        machineBrand: survey.machineBrand,
        machineModel: survey.machineModel,
        contType: contType,
        createdBy: props.createdBy,
      });
    }

    let repairCont: RepairContEntity;
    // if isInOut = 'I', create REPAIR_CONT record, else update REPAIR_CONT record with surveyOutNo
    if (isInOut === SurveyInOut.IN) {
      repairCont = RepairContEntity.create({
        idCont: container.idCont as string,
        containerNo: container.containerNo,
        operationCode: container.operationCode,
        bookingNo: container.bookingNo,
        blNo: container.blNo,
        location:
          container.area ??
          `${container.block ?? ''}-${container.bay ?? ''}-${
            container.row ?? ''
          }-${container.tier ?? ''}`,
        localSizeType: container.localSizeType,
        isoSizeType: container.isoSizeType,
        conditionCode: survey?.conditionCode ?? container.conditionCode,
        conditionMachineCode:
          survey?.conditionMachineCode ?? container.conditionMachineCode,
        classifyCode: survey?.classifyCode ?? container.classifyCode,
        statusCode: EstimateStatus.SURVEY,
        surveyInNo: surveyNo,
        createdBy: props.createdBy,
      });
    } else {
      // find repair cont by idCont
      const foundRepairCont = await this.repairContRepo.findOne({
        idCont: container.idCont as string,
        surveyOutNo: null,
      });
      if (foundRepairCont.isNone()) {
        return Err(new RepairContNotFoundError());
      }
      repairCont = foundRepairCont.unwrap();
      // set surveyOutNo to repairCont
      repairCont.update({
        surveyOutNo: surveyNo,
        updatedBy: props.createdBy,
      });
    }

    let estimate: EstimateEntity | undefined;
    const prefixEstimate = 'E';
    const estimateNo = await this.estimateService.generateEstimateNo(
      prefixEstimate,
    );

    if (estimateProps) {
      estimate = EstimateEntity.create({
        ...estimateProps,
        idCont: container.idCont as string,
        estimateNo,
        estimateDetails: await Promise.all(
          estimateProps.estimateDetails.map(async (detail) => ({
            ...detail,
            isClean: await this.surveyService.getIsClean(detail.repCode),
            estimateNo,
            createdBy: props.createdBy,
          })),
        ),
      });

      // set estimateNo to repairCont
      repairCont.update({
        estimateNo,
        updatedBy: props.createdBy,
      });
    }
    // use for transaction
    const createdObject: { type: string; entity: any }[] = [];

    if (isAddNew) {
      await this.infoContRepo.insert(infoCont);
    } else {
      await this.infoContRepo.update(infoCont);
    }

    // create repair cont
    try {
      const createdRepairCont =
        isInOut === SurveyInOut.IN
          ? await this.repairContRepo.insert(repairCont)
          : await this.repairContRepo.update(repairCont);

      createdObject.push({ type: 'repairCont', entity: createdRepairCont });

      // set idRep to survey
      survey.update({
        idRep: createdRepairCont.id,
        updatedBy: props.createdBy,
      });
      // set idRep to estimate
      if (estimate) {
        estimate.update({
          idRef: createdRepairCont.id,
          updatedBy: props.createdBy,
        });
      }

      // create survey
      const createdSurvey = await this.surveyRepo.createSurvey(survey);
      createdObject.push({ type: 'survey', entity: createdSurvey });

      let localDmgDetailsEntity: LocalDmgDetailEntity[] | undefined;

      if (localDmgDetails) {
        localDmgDetailsEntity = localDmgDetails.map((props) => {
          return LocalDmgDetailEntity.create({
            ...props,
            idSurvey: createdSurvey.id,
            idCont: container.idCont as string,
          });
        });
      }

      if (localDmgDetailsEntity) {
        const createdLocalDmgDetails = await Promise.all(
          localDmgDetailsEntity.map(async (detail) => {
            return this.localDmgDetailRepo.createLocalDmgDetail(detail);
          }),
        );

        createdObject.push({
          type: 'localDmgDetail',
          entity: createdLocalDmgDetails,
        });
      }
      // create estimate
      if (estimate) {
        const createdEstimate = await this.estimateRepo.createEstimate(
          estimate,
        );

        createdObject.push({ type: 'estimate', entity: createdEstimate });

        // if estimate includes estimate details, add EstimateDetailCreatedUpdatedDomainEvent event
        if (createdEstimate?.estimateDetails.length) {
          createdEstimate.estimateDetails.forEach((estimateDetail) => {
            estimateDetail.addEvent(
              new EstimateDetailCreatedUpdatedDomainEvent({
                aggregateId: estimateDetail.id,
                aggregateOpr: props.operationCode,
              }),
            );

            estimateDetail.publishEvents(this.eventEmitter);
          });

          // nếu có estimate detail thì status code của repair-cont là E
          createdRepairCont.update({
            statusCode: EstimateStatus.ESTIMATE,
            updatedBy: props.createdBy,
          });
          console.log('check repairCont: ', repairCont);
          await this.repairContRepo.update(createdRepairCont);
        }
      }
      return Ok(createdSurvey);
    } catch (error: any) {
      console.log('error: ', error);
      // rollback
      createdObject.forEach(async (obj) => {
        switch (obj.type) {
          case 'repairCont':
            await this.repairContRepo.delete(obj.entity);
            break;
          case 'localDmgDetail':
            await this.localDmgDetailRepo.delete(obj.entity);
            break;
          case 'estimate':
            await this.estimateRepo.delete(obj.entity);
            break;
          case 'survey':
            await this.surveyRepo.delete(obj.entity);
            break;
        }
      });

      throw error;
    }
  }
}
