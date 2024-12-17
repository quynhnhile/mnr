import { Mapper } from '@libs/ddd';
import { EstimateDetailEntity } from '@modules/estimate/domain/estimate-detail.entity';
import { Injectable } from '@nestjs/common';
import {
  EstimateDetail as EstimateDetailModel,
  JobRepairClean,
  Prisma,
} from '@prisma/client';
import { JobRepairCleanEntity } from '@src/modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanResponseDto } from '@src/modules/job-repair-clean/dtos/job-repair-clean.response.dto';
import { EstimateDetailResponseDto } from '../dtos/estimate-detail.response.dto';

@Injectable()
export class EstimateDetailMapper
  implements
    Mapper<
      EstimateDetailEntity,
      EstimateDetailModel,
      EstimateDetailResponseDto
    >
{
  toPersistence(entity: EstimateDetailEntity): EstimateDetailModel {
    const copy = entity.getProps();
    const record: EstimateDetailModel = {
      id: copy.id,
      // Map entity properties to record
      idEstimate: copy.idEstimate,
      estimateNo: copy.estimateNo,
      compCode: copy.compCode,
      locCode: copy.locCode || null,
      damCode: copy.damCode || null,
      repCode: copy.repCode,
      length: new Prisma.Decimal(copy.length),
      width: new Prisma.Decimal(copy.width),
      quantity: copy.quantity,
      unit: copy.unit || null,
      hours: copy.hours ? new Prisma.Decimal(copy.hours) : null,
      cwo: copy.cwo || null,
      laborRate: copy.laborRate ? new Prisma.Decimal(copy.laborRate) : null,
      laborPrice: copy.laborPrice ? new Prisma.Decimal(copy.laborPrice) : null,
      matePrice: copy.matePrice ? new Prisma.Decimal(copy.matePrice) : null,
      total: copy.total ? new Prisma.Decimal(copy.total) : null,
      currency: copy.currency || null,
      payerCode: copy.payerCode,
      symbolCode: copy.symbolCode,
      rate: new Prisma.Decimal(copy.rate),
      isClean: copy.isClean ?? false,
      cleanMethodCode: copy.cleanMethodCode || null,
      cleanModeCode: copy.cleanModeCode || null,
      statusCode: copy.statusCode,
      localApprovalDate: copy.localApprovalDate || null,
      localApprovalBy: copy.localApprovalBy || null,
      approvalDate: copy.approvalDate || null,
      approvalBy: copy.approvalBy || null,
      reqActiveDate: copy.reqActiveDate || null,
      reqActiveBy: copy.reqActiveBy || null,
      sendOprDate: copy.sendOprDate || null,
      sendOprBy: copy.sendOprBy || null,
      cancelDate: copy.cancelDate || null,
      cancelBy: copy.cancelBy || null,
      isOprCancel: copy.isOprCancel ?? false,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: EstimateDetailModel & { jobRepairCleans: JobRepairClean[] },
  ): EstimateDetailEntity {
    return new EstimateDetailEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idEstimate: record.idEstimate,
        estimateNo: record.estimateNo,
        compCode: record.compCode,
        locCode: record.locCode,
        damCode: record.damCode,
        repCode: record.repCode,
        length: record.length.toNumber(),
        width: record.width.toNumber(),
        square: record.length.toNumber() * record.width.toNumber(),
        quantity: record.quantity,
        unit: record.unit || undefined,
        hours: record.hours ? record.hours.toNumber() : undefined,
        cwo: record.cwo || undefined,
        laborRate: record.laborRate ? record.laborRate.toNumber() : undefined,
        laborPrice: record.laborPrice
          ? record.laborPrice.toNumber()
          : undefined,
        matePrice: record.matePrice ? record.matePrice.toNumber() : undefined,
        total: record.total ? record.total.toNumber() : undefined,
        currency: record.currency || undefined,
        payerCode: record.payerCode,
        symbolCode: record.symbolCode,
        rate: record.rate.toNumber(),
        isClean: record.isClean,
        cleanMethodCode: record.cleanMethodCode,
        cleanModeCode: record.cleanModeCode,
        statusCode: record.statusCode,
        localApprovalDate: record.localApprovalDate,
        localApprovalBy: record.localApprovalBy,
        approvalDate: record.approvalDate,
        approvalBy: record.approvalBy,
        reqActiveDate: record.reqActiveDate,
        reqActiveBy: record.reqActiveBy,
        cancelDate: record.cancelDate,
        cancelBy: record.cancelBy,
        isOprCancel: record.isOprCancel,
        note: record.note || undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        jobRepairCleans: record.jobRepairCleans
          ? record.jobRepairCleans.map(
              (jobRepairClean) =>
                new JobRepairCleanEntity({
                  id: jobRepairClean.id,
                  createdAt: jobRepairClean.createdAt,
                  updatedAt: jobRepairClean.updatedAt,
                  props: {
                    id: jobRepairClean.id,
                    idRef: jobRepairClean.idRef,
                    idCont: jobRepairClean.idCont,
                    containerNo: jobRepairClean.containerNo,
                    idEstItem: jobRepairClean.idEstItem || undefined,
                    estimateNo: jobRepairClean.estimateNo,
                    idJob: jobRepairClean.idJob,
                    seq: jobRepairClean.seq,
                    repCode: jobRepairClean.repCode,
                    isClean: jobRepairClean.isClean,
                    cleanMethodCode: jobRepairClean.cleanMethodCode,
                    cleanModeCode: jobRepairClean.cleanModeCode,
                    startBy: jobRepairClean.startBy,
                    startDate: jobRepairClean.startDate,
                    finishBy: jobRepairClean.finishBy,
                    finishDate: jobRepairClean.finishDate,
                    cancelBy: jobRepairClean.cancelBy,
                    cancelDate: jobRepairClean.cancelDate,
                    completeBy: jobRepairClean.completeBy,
                    completeDate: jobRepairClean.completeDate,
                    vendorCode: jobRepairClean.vendorCode,
                    isReclean: jobRepairClean.isReclean,
                    idRefReclean: jobRepairClean.idRefReclean,
                    kcsStatus: jobRepairClean.kcsStatus,
                    kcsNote: jobRepairClean.kcsNote,
                    note: jobRepairClean.note,
                    jobStatus: jobRepairClean.jobStatus,
                    createdBy: jobRepairClean.createdBy,
                  },
                  skipValidation: true,
                }),
            )
          : [],
      },
      skipValidation: true,
    });
  }

  toResponse(entity: EstimateDetailEntity): EstimateDetailResponseDto {
    const props = entity.getProps();
    const response = new EstimateDetailResponseDto(entity);
    // Map entity properties to response DTO
    response.idEstimate = props.idEstimate.toString();
    response.estimateNo = props.estimateNo;
    response.compCode = props.compCode;
    response.locCode = props.locCode || null;
    response.damCode = props.damCode || null;
    response.repCode = props.repCode;
    response.length = props.length;
    response.width = props.width;
    response.quantity = props.quantity;
    response.unit = props.unit;
    response.hours = props.hours;
    response.cwo = props.cwo;
    response.laborRate = props.laborRate;
    response.laborPrice = props.laborPrice;
    response.matePrice = props.matePrice;
    response.total = props.total;
    response.currency = props.currency;
    response.payerCode = props.payerCode;
    response.symbolCode = props.symbolCode;
    response.rate = props.rate;
    response.isClean = props.isClean;
    response.cleanMethodCode = props.cleanMethodCode;
    response.cleanModeCode = props.cleanModeCode;
    response.statusCode = props.statusCode;
    response.localApprovalDate = props.localApprovalDate;
    response.localApprovalBy = props.localApprovalBy;
    response.approvalDate = props.approvalDate;
    response.approvalBy = props.approvalBy;
    response.reqActiveDate = props.reqActiveDate;
    response.reqActiveBy = props.reqActiveBy;
    response.cancelDate = props.cancelDate;
    response.cancelBy = props.cancelBy;
    response.isOprCancel = props.isOprCancel;
    response.note = props.note;
    response.jobRepairCleans = props.jobRepairCleans?.map((jobRepairClean) => {
      const jobRepairCleanResponse = new JobRepairCleanResponseDto();
      jobRepairCleanResponse.id = jobRepairClean.id.toString();
      jobRepairCleanResponse.idRef = jobRepairClean.idRef.toString();
      jobRepairCleanResponse.idCont = jobRepairClean.idCont;
      jobRepairCleanResponse.containerNo = jobRepairClean.containerNo;
      jobRepairCleanResponse.idEstItem = jobRepairClean.idEstItem?.toString();
      jobRepairCleanResponse.estimateNo = jobRepairClean.estimateNo;
      jobRepairCleanResponse.idJob = jobRepairClean.idJob;
      jobRepairCleanResponse.seq = jobRepairClean.seq;
      jobRepairCleanResponse.repCode = jobRepairClean.repCode;
      jobRepairCleanResponse.isClean = jobRepairClean.isClean;
      jobRepairCleanResponse.cleanMethodCode =
        jobRepairClean.cleanMethodCode || null;
      jobRepairCleanResponse.cleanModeCode =
        jobRepairClean.cleanModeCode || null;
      jobRepairCleanResponse.startBy = jobRepairClean.startBy || null;
      jobRepairCleanResponse.startDate = jobRepairClean.startDate || null;
      jobRepairCleanResponse.finishBy = jobRepairClean.finishBy || null;
      jobRepairCleanResponse.finishDate = jobRepairClean.finishDate || null;
      jobRepairCleanResponse.cancelBy = jobRepairClean.cancelBy || null;
      jobRepairCleanResponse.cancelDate = jobRepairClean.cancelDate || null;
      jobRepairCleanResponse.completeBy = jobRepairClean.completeBy || null;
      jobRepairCleanResponse.completeDate = jobRepairClean.completeDate || null;
      jobRepairCleanResponse.vendorCode = jobRepairClean.vendorCode || null;
      jobRepairCleanResponse.isReclean = jobRepairClean.isReclean;
      jobRepairCleanResponse.idRefReclean =
        jobRepairClean.idRefReclean?.toString() || null;
      jobRepairCleanResponse.kcsStatus = jobRepairClean.kcsStatus;
      jobRepairCleanResponse.kcsNote = jobRepairClean.kcsNote || null;
      jobRepairCleanResponse.note = jobRepairClean.note || null;
      jobRepairCleanResponse.jobStatus = jobRepairClean.jobStatus;

      return jobRepairCleanResponse;
    });
    return response;
  }
}
