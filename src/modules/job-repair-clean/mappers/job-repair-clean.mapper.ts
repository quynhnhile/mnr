import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { JobRepairClean as JobRepairCleanModel } from '@prisma/client';
import { JobRepairCleanEntity } from '../domain/job-repair-clean.entity';
import { JobRepairCleanResponseDto } from '../dtos/job-repair-clean.response.dto';

@Injectable()
export class JobRepairCleanMapper
  implements
    Mapper<
      JobRepairCleanEntity,
      JobRepairCleanModel,
      JobRepairCleanResponseDto
    >
{
  toPersistence(entity: JobRepairCleanEntity): JobRepairCleanModel {
    const copy = entity.getProps();
    const record: JobRepairCleanModel = {
      id: copy.id,
      // Map entity properties to record
      idRef: copy.idRef,
      idCont: copy.idCont,
      containerNo: copy.containerNo,
      idEstItem: copy.idEstItem || null,
      estimateNo: copy.estimateNo,
      idJob: copy.idJob,
      seq: copy.seq,
      repCode: copy.repCode,
      isClean: copy.isClean ?? false,
      cleanMethodCode: copy.cleanMethodCode || null,
      cleanModeCode: copy.cleanModeCode || null,
      jobStatus: copy.jobStatus,
      startDate: copy.startDate || null,
      startBy: copy.startBy || null,
      finishDate: copy.finishDate || null,
      finishBy: copy.finishBy || null,
      cancelDate: copy.cancelDate || null,
      cancelBy: copy.cancelBy || null,
      completeDate: copy.completeDate || null,
      completeBy: copy.completeBy || null,
      vendorCode: copy.vendorCode || null,
      isReclean: copy.isReclean,
      idRefReclean: copy.idRefReclean || null,
      recleanReason: copy.recleanReason || null,
      kcsStatus: copy.kcsStatus,
      kcsNote: copy.kcsNote || null,
      note: copy.note || null,

      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: JobRepairCleanModel): JobRepairCleanEntity {
    return new JobRepairCleanEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idRef: record.idRef,
        idCont: record.idCont,
        containerNo: record.containerNo,
        idEstItem: record.idEstItem || undefined,
        estimateNo: record.estimateNo,
        idJob: record.idJob,
        seq: record.seq,
        repCode: record.repCode,
        isClean: record.isClean,
        cleanMethodCode: record.cleanMethodCode,
        cleanModeCode: record.cleanModeCode,
        jobStatus: record.jobStatus,
        startDate: record.startDate,
        startBy: record.startBy,
        finishDate: record.finishDate,
        finishBy: record.finishBy,
        cancelDate: record.cancelDate,
        cancelBy: record.cancelBy,
        completeDate: record.completeDate,
        completeBy: record.completeBy,
        vendorCode: record.vendorCode,
        isReclean: record.isReclean,
        idRefReclean: record.idRefReclean,
        recleanReason: record.recleanReason,
        kcsStatus: record.kcsStatus,
        kcsNote: record.kcsNote,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: JobRepairCleanEntity): JobRepairCleanResponseDto {
    const props = entity.getProps();
    const response = new JobRepairCleanResponseDto();
    // Map entity properties to response DTO
    response.id = props.id.toString();
    response.idRef = props.idRef.toString();
    response.idCont = props.idCont;
    response.containerNo = props.containerNo;
    response.idEstItem = props.idEstItem
      ? props.idEstItem.toString()
      : undefined;
    response.estimateNo = props.estimateNo;
    response.idJob = props.idJob;
    response.seq = props.seq;
    response.repCode = props.repCode;
    response.isClean = props.isClean;
    response.cleanMethodCode = props.cleanMethodCode || null;
    response.cleanModeCode = props.cleanModeCode || null;
    response.jobStatus = props.jobStatus;
    response.startDate = props.startDate || null;
    response.startBy = props.startBy || null;
    response.finishDate = props.finishDate || null;
    response.finishBy = props.finishBy || null;
    response.cancelDate = props.cancelDate || null;
    response.cancelBy = props.cancelBy || null;
    response.completeDate = props.completeDate || null;
    response.completeBy = props.completeBy || null;
    response.vendorCode = props.vendorCode || null;
    response.isReclean = props.isReclean;
    response.idRefReclean = props.idRefReclean?.toString() || null;
    response.recleanReason = props.recleanReason || null;
    response.kcsStatus = props.kcsStatus || null;
    response.kcsNote = props.kcsNote || null;
    response.note = props.note || null;
    return response;
  }
}
