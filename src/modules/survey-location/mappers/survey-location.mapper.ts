import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { SurveyLocation as SurveyLocationModel } from '@prisma/client';
import { SurveyLocationEntity } from '../domain/survey-location.entity';
import { SurveyLocationResponseDto } from '../dtos/survey-location.response.dto';
@Injectable()
export class SurveyLocationMapper
  implements
    Mapper<
      SurveyLocationEntity,
      SurveyLocationModel,
      SurveyLocationResponseDto
    >
{
  toPersistence(entity: SurveyLocationEntity): SurveyLocationModel {
    const copy = entity.getProps();
    const record: SurveyLocationModel = {
      id: copy.id,
      // Map entity properties to record
      surveyLocationCode: copy.surveyLocationCode,
      surveyLocationName: copy.surveyLocationName,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: SurveyLocationModel): SurveyLocationEntity {
    return new SurveyLocationEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        surveyLocationCode: record.surveyLocationCode,
        surveyLocationName: record.surveyLocationName,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: SurveyLocationEntity): SurveyLocationResponseDto {
    const props = entity.getProps();
    const response = new SurveyLocationResponseDto(entity);
    // Map entity properties to response DTO
    response.surveyLocationCode = props.surveyLocationCode;
    response.surveyLocationName = props.surveyLocationName;
    response.note = props.note || null;

    return response;
  }
}
