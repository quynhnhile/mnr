import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { SurveyDetail as SurveyDetailModel } from '@prisma/client';
import { SurveyDetailEntity } from '../domain/survey-detail.entity';
import { SurveyDetailResponseDto } from '../dtos/survey-detail.response.dto';
@Injectable()
export class SurveyDetailMapper
  implements
    Mapper<SurveyDetailEntity, SurveyDetailModel, SurveyDetailResponseDto>
{
  toPersistence(entity: SurveyDetailEntity): SurveyDetailModel {
    const copy = entity.getProps();
    const record: SurveyDetailModel = {
      id: copy.id,
      // Map entity properties to record
      idSurvey: copy.idSurvey,
      idCont: copy.idCont,
      containerNo: copy.containerNo,
      surveyNo: copy.surveyNo,
      surveyDate: copy.surveyDate,
      surveyBy: copy.surveyBy,
      noteSurvey: copy.noteSurvey || null,
      note: copy.note || null,

      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: SurveyDetailModel): SurveyDetailEntity {
    return new SurveyDetailEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idSurvey: record.idSurvey,
        idCont: record.idCont,
        containerNo: record.containerNo,
        surveyNo: record.surveyNo,
        surveyDate: record.surveyDate,
        surveyBy: record.surveyBy,
        noteSurvey: record.noteSurvey || null,
        note: record.note || null,

        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: SurveyDetailEntity): SurveyDetailResponseDto {
    const props = entity.getProps();
    const response = new SurveyDetailResponseDto(entity);
    // Map entity properties to response DTO
    response.idSurvey = props.idSurvey.toString();
    response.idCont = props.idCont;
    response.containerNo = props.containerNo;
    response.surveyNo = props.surveyNo;
    response.surveyDate = props.surveyDate;
    response.surveyBy = props.surveyBy;
    response.noteSurvey = props.noteSurvey;
    response.note = props.note;

    return response;
  }
}
