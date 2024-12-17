import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { JobTask as JobTaskModel } from '@prisma/client';
import { JobTaskEntity } from '../domain/job-task.entity';
import { JobTaskResponseDto } from '../dtos/job-task.response.dto';

@Injectable()
export class JobTaskMapper
  implements Mapper<JobTaskEntity, JobTaskModel, JobTaskResponseDto>
{
  toPersistence(entity: JobTaskEntity): JobTaskModel {
    const copy = entity.getProps();
    const record: JobTaskModel = {
      id: copy.id,
      // Map entity properties to record
      jobTaskCode: copy.jobTaskCode,
      jobTaskName: copy.jobTaskName,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: JobTaskModel): JobTaskEntity {
    return new JobTaskEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        jobTaskCode: record.jobTaskCode,
        jobTaskName: record.jobTaskName,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: JobTaskEntity): JobTaskResponseDto {
    const props = entity.getProps();
    const response = new JobTaskResponseDto(entity);
    // Map entity properties to response DTO
    response.jobTaskCode = props.jobTaskCode;
    response.jobTaskName = props.jobTaskName;
    response.note = props.note || undefined;
    return response;
  }
}
