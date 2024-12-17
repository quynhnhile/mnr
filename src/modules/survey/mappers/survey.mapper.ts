import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import {
  Prisma,
  SurveyDetail as SurveyDetailModel,
  Survey as SurveyModel,
} from '@prisma/client';
import { SurveyDetailEntity } from '../domain/survey-detail.entity';
import { SurveyEntity } from '../domain/survey.entity';
import { SurveyInOut } from '../domain/survey.type';
import { SurveyResponseDto } from '../dtos/survey.response.dto';

@Injectable()
export class SurveyMapper
  implements Mapper<SurveyEntity, SurveyModel, SurveyResponseDto>
{
  toPersistence(entity: SurveyEntity): SurveyModel & {
    surveyDetails?: Prisma.SurveyDetailCreateNestedManyWithoutSurveyInput;
  } {
    const copy = entity.getProps();
    const record: SurveyModel & {
      surveyDetails?: Prisma.SurveyDetailCreateNestedManyWithoutSurveyInput;
    } = {
      id: copy.id,
      // Map entity properties to record
      idRep: BigInt(copy.idRep),
      idCont: copy.idCont,
      containerNo: copy.containerNo,
      surveyNo: copy.surveyNo,
      eirNo: copy.eirNo || null,
      fe: copy.fe || null,
      isInOut: copy.isInOut,
      surveyLocationCode: copy.surveyLocationCode,
      contAge: copy.contAge || null,
      machineAge: copy.machineAge || null,
      machineBrand: copy.machineBrand || null,
      machineModel: copy.machineModel || null,
      conditionCode: copy.conditionCode || null,
      conditionMachineCode: copy.conditionMachineCode || null,
      classifyCode: copy.classifyCode || null,
      cleanMethodCode: copy.cleanMethodCode || null,
      cleanModeCode: copy.cleanModeCode || null,
      deposit: copy.deposit ? new Prisma.Decimal(copy.deposit) : null,
      vendorCode: copy.vendorCode || null,
      idCheck: copy.idCheck || null,
      checkNo: copy.checkNo || null,
      isTankOutside:
        copy.isTankOutside !== undefined ? copy.isTankOutside : null,
      isTankInside: copy.isTankInside !== undefined ? copy.isTankInside : null,
      isTest1bar: copy.isTest1bar !== undefined ? copy.isTest1bar : null,
      preSurveyNo: copy.preSurveyNo || null,
      surveyDate: copy.surveyDate,
      surveyBy: copy.surveyBy,
      finishDate: copy.finishDate || null,
      finishBy: copy.finishBy || null,
      isRemoveMark: copy.isRemoveMark !== undefined ? copy.isRemoveMark : null,
      removeMark: copy.removeMark !== undefined ? copy.removeMark : null,
      isRevice: copy.isRevice !== undefined ? copy.isRevice : null,
      altSurveyNo: copy.altSurveyNo || null,
      noteSurvey: copy.noteSurvey || null,
      noteCont: copy.noteCont || null,
      noteDam: copy.noteDam || null,
      noteSpecialHandling: copy.noteSpecialHandling || null,
      noteEir: copy.noteEir || null,
      noteMachine: copy.noteMachine || null,
      note: copy.note || null,
      isException: copy.isException !== undefined ? copy.isException : null,
      pti: copy.pti !== undefined ? copy.pti : null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    if (copy.surveyDetails.length) {
      record.surveyDetails = {
        createMany: {
          data: copy.surveyDetails.map((surveyDetail) => ({
            idCont: copy.idCont,
            containerNo: copy.containerNo,
            surveyNo: copy.surveyNo,
            surveyDate: surveyDetail.surveyDate,
            surveyBy: surveyDetail.surveyBy,
            createdBy: copy.createdBy,
            updatedBy: copy.updatedBy || null,
          })),
        },
      };
    }

    return record;
  }

  toDomain(
    record: SurveyModel & {
      surveyDetails?: SurveyDetailModel[];
    },
  ): SurveyEntity {
    return new SurveyEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idRep: record.idRep,
        idCont: record.idCont,
        containerNo: record.containerNo,
        surveyNo: record.surveyNo,
        eirNo: record.eirNo || undefined,
        fe: record.fe || undefined,
        isInOut: record.isInOut as SurveyInOut,
        surveyLocationCode: record.surveyLocationCode,
        contAge: record.contAge || undefined,
        machineAge: record.machineAge || undefined,
        machineBrand: record.machineBrand || undefined,
        machineModel: record.machineModel || undefined,
        conditionCode: record.conditionCode || undefined,
        conditionMachineCode: record.conditionMachineCode || undefined,
        classifyCode: record.classifyCode || undefined,
        cleanMethodCode: record.cleanMethodCode || undefined,
        cleanModeCode: record.cleanModeCode || undefined,
        deposit: record.deposit ? record.deposit.toNumber() : undefined,
        vendorCode: record.vendorCode || undefined,
        idCheck: record.idCheck || undefined,
        checkNo: record.checkNo || undefined,
        isTankOutside:
          record.isTankOutside !== null ? record.isTankOutside : undefined,
        isTankInside:
          record.isTankInside !== null ? record.isTankInside : undefined,
        isTest1bar: record.isTest1bar !== null ? record.isTest1bar : undefined,
        preSurveyNo: record.preSurveyNo || undefined,
        surveyDate: record.surveyDate,
        surveyBy: record.surveyBy,
        finishDate: record.finishDate || undefined,
        finishBy: record.finishBy || undefined,
        isRemoveMark:
          record.isRemoveMark !== null ? record.isRemoveMark : undefined,
        removeMark: record.removeMark !== null ? record.removeMark : undefined,
        isRevice: record.isRevice !== null ? record.isRevice : undefined,
        altSurveyNo: record.altSurveyNo || undefined,
        noteSurvey: record.noteSurvey || undefined,
        noteCont: record.noteCont || undefined,
        noteDam: record.noteDam || undefined,
        noteSpecialHandling: record.noteSpecialHandling || undefined,
        noteEir: record.noteEir || undefined,
        noteMachine: record.noteMachine || undefined,
        note: record.note || undefined,
        isException: record.isException || undefined,
        pti: record.pti !== null ? record.pti : undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        surveyDetails: record?.surveyDetails
          ? record.surveyDetails.map(
              (surveyDetail) =>
                new SurveyDetailEntity({
                  id: surveyDetail.id,
                  props: {
                    idSurvey: surveyDetail.idSurvey,
                    idCont: surveyDetail.idCont,
                    containerNo: surveyDetail.containerNo,
                    surveyNo: surveyDetail.surveyNo,
                    surveyDate: surveyDetail.surveyDate,
                    surveyBy: surveyDetail.surveyBy,
                    createdBy: surveyDetail.createdBy,
                    updatedBy: surveyDetail.updatedBy,
                  },
                  skipValidation: true,
                }),
            )
          : [],
      },
      skipValidation: true,
    });
  }

  toResponse(entity: SurveyEntity): SurveyResponseDto {
    const props = entity.getProps();
    const response = new SurveyResponseDto(entity);
    // Map entity properties to response DTO
    response.idRep = props.idRep ? props.idRep.toString() : undefined;
    response.idCont = props.idCont;
    response.containerNo = props.containerNo;
    response.surveyNo = props.surveyNo;
    response.eirNo = props.eirNo;
    response.fe = props.fe;
    response.isInOut = props.isInOut;
    response.surveyLocationCode = props.surveyLocationCode;
    response.contAge = props.contAge;
    response.machineAge = props.machineAge;
    response.machineBrand = props.machineBrand;
    response.machineModel = props.machineModel;
    response.conditionCode = props.conditionCode;
    response.conditionMachineCode = props.conditionMachineCode;
    response.classifyCode = props.classifyCode;
    response.cleanMethodCode = props.cleanMethodCode;
    response.cleanModeCode = props.cleanModeCode;
    response.deposit = props.deposit;
    response.vendorCode = props.vendorCode;
    response.idCheck = props.idCheck;
    response.checkNo = props.checkNo;
    response.isTankOutside = props.isTankOutside;
    response.isTankInside = props.isTankInside;
    response.isTest1bar = props.isTest1bar;
    response.preSurveyNo = props.preSurveyNo;
    response.surveyDate = props.surveyDate;
    response.surveyBy = props.surveyBy;
    response.finishDate = props.finishDate;
    response.finishBy = props.finishBy;
    response.isRemoveMark = props.isRemoveMark;
    response.removeMark = props.removeMark;
    response.isRevice = props.isRevice;
    response.altSurveyNo = props.altSurveyNo;
    response.noteSurvey = props.noteSurvey;
    response.noteCont = props.noteCont;
    response.noteDam = props.noteDam;
    response.noteSpecialHandling = props.noteSpecialHandling;
    response.noteEir = props.noteEir;
    response.noteMachine = props.noteMachine;
    response.note = props.note;
    response.isException = props.isException;
    response.pti = props.pti;

    return response;
  }
}
