import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import {
  EstimateDetail as EstimateDetailModel,
  Estimate as EstimateModel,
  Prisma,
} from '@prisma/client';
import { EstimateDetailEntity } from '../domain/estimate-detail.entity';
import { EstimateEntity } from '../domain/estimate.entity';
import { EstimateResponseDto } from '../dtos/estimate.response.dto';

@Injectable()
export class EstimateMapper
  implements Mapper<EstimateEntity, EstimateModel, EstimateResponseDto>
{
  toPersistence(entity: EstimateEntity): EstimateModel & {
    estimateDetails?: Prisma.EstimateDetailCreateNestedManyWithoutEstimateInput;
  } {
    const copy = entity.getProps();
    const record: EstimateModel & {
      estimateDetails?: Prisma.EstimateDetailCreateNestedManyWithoutEstimateInput;
    } = {
      id: copy.id,
      // Map entity properties to record
      idRef: copy.idRef,
      idCont: copy.idCont,
      containerNo: copy.containerNo,
      estimateNo: copy.estimateNo,
      estimateBy: copy.estimateBy || null,
      estimateDate: copy.estimateDate || null,
      statusCode: copy.statusCode,
      localApprovalBy: copy.localApprovalBy || null,
      localApprovalDate: copy.localApprovalDate || null,
      sendOprBy: copy.sendOprBy || null,
      sendOprDate: copy.sendOprDate || null,
      approvalBy: copy.approvalBy || null,
      approvalDate: copy.approvalDate || null,
      cancelBy: copy.cancelBy || null,
      cancelDate: copy.cancelDate || null,
      isOprCancel: copy.isOprCancel || null,
      reqActiveBy: copy.reqActiveBy || null,
      reqActiveDate: copy.reqActiveDate || null,
      altEstimateNo: copy.altEstimateNo || null,
      noteEstimate: copy.noteEstimate || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    if (copy.estimateDetails) {
      record.estimateDetails = {
        createMany: {
          data: copy.estimateDetails.map((estimateDetail) => {
            const props = estimateDetail.getProps();

            return {
              estimateNo: copy.estimateNo,
              compCode: props.compCode,
              locCode: props.locCode,
              damCode: props.damCode,
              repCode: props.repCode,
              length: new Prisma.Decimal(props.length),
              width: new Prisma.Decimal(props.width),
              quantity: props.quantity,
              unit: props.unit,
              hours: props.hours ? new Prisma.Decimal(props.hours) : null,
              cwo: props.cwo,
              laborRate: props.laborRate
                ? new Prisma.Decimal(props.laborRate)
                : null,
              laborPrice: props.laborPrice
                ? new Prisma.Decimal(props.laborPrice)
                : null,
              matePrice: props.matePrice
                ? new Prisma.Decimal(props.matePrice)
                : null,
              total: props.total ? new Prisma.Decimal(props.total) : null,
              currency: props.currency,
              payerCode: props.payerCode,
              symbolCode: props.symbolCode,
              rate: new Prisma.Decimal(props.rate),
              isClean: props.isClean ?? false,
              cleanMethodCode: props.cleanMethodCode || null,
              cleanModeCode: props.cleanModeCode || null,
              statusCode: copy.statusCode,
              isOprCancel: copy.isOprCancel ?? false,
              note: copy.note || null,
              createdBy: copy.createdBy,
              updatedBy: copy.updatedBy || null,
            };
          }),
        },
      };
    }

    return record;
  }

  toDomain(
    record: EstimateModel & {
      estimateDetails?: EstimateDetailModel[];
      totalEstimateValue?: number;
      estimateDetailCount?: number;
      localApprovalEstimateCount?: number;
      operationApprovalEstimateCount?: number;
      operationRejectedEstimateCount?: number;
      rejectedEstimateCount?: number;
    },
  ): EstimateEntity {
    return new EstimateEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idRef: record.idRef,
        idCont: record.idCont,
        containerNo: record.containerNo,
        estimateNo: record.estimateNo,
        estimateBy: record.estimateBy,
        estimateDate: record.estimateDate,
        statusCode: record.statusCode,
        localApprovalBy: record.localApprovalBy || null,
        localApprovalDate: record.localApprovalDate || null,
        sendOprBy: record.sendOprBy || null,
        sendOprDate: record.sendOprDate || null,
        approvalBy: record.approvalBy || null,
        approvalDate: record.approvalDate || null,
        cancelBy: record.cancelBy || null,
        cancelDate: record.cancelDate || null,
        isOprCancel: record.isOprCancel || null,
        reqActiveBy: record.reqActiveBy || null,
        reqActiveDate: record.reqActiveDate || null,
        altEstimateNo: record.altEstimateNo || null,
        noteEstimate: record.noteEstimate || null,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additonal props
        estimateDetails: record?.estimateDetails
          ? record.estimateDetails.map((estimateDetail) => {
              const { id, ...restEstimateDetail } = estimateDetail;
              return new EstimateDetailEntity({
                id,
                props: {
                  ...restEstimateDetail,
                  length: restEstimateDetail.length.toNumber(),
                  width: restEstimateDetail.width.toNumber(),
                  square:
                    restEstimateDetail.length.toNumber() *
                    restEstimateDetail.width.toNumber(),
                  unit: restEstimateDetail.unit || undefined,
                  hours: restEstimateDetail.hours
                    ? restEstimateDetail.hours.toNumber()
                    : undefined,
                  cwo: restEstimateDetail.cwo || undefined,
                  laborRate: restEstimateDetail.laborRate
                    ? restEstimateDetail.laborRate.toNumber()
                    : undefined,
                  laborPrice: restEstimateDetail.laborPrice
                    ? restEstimateDetail.laborPrice.toNumber()
                    : undefined,
                  matePrice: restEstimateDetail.matePrice
                    ? restEstimateDetail.matePrice.toNumber()
                    : undefined,
                  rate: restEstimateDetail.rate.toNumber(),
                  total: restEstimateDetail.total
                    ? restEstimateDetail.total.toNumber()
                    : undefined,
                  currency: restEstimateDetail.currency || undefined,
                  note: restEstimateDetail.note || undefined,
                  jobRepairCleans: [],
                },
                skipValidation: true,
              });
            })
          : [],

        totalEstimateValue: record.totalEstimateValue,
        estimateDetailCount: record.estimateDetailCount,
        localApprovalEstimateCount: record.localApprovalEstimateCount,
        operationApprovalEstimateCount: record.operationApprovalEstimateCount,
        operationRejectedEstimateCount: record.operationRejectedEstimateCount,
        rejectedEstimateCount: record.rejectedEstimateCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: EstimateEntity): EstimateResponseDto {
    const props = entity.getProps();
    const response = new EstimateResponseDto(entity);
    // Map entity properties to response DTO
    response.idRef = props.idRef.toString();
    response.idCont = props.idCont;
    response.containerNo = props.containerNo;
    response.estimateNo = props.estimateNo;
    response.estimateBy = props.estimateBy || undefined;
    response.estimateDate = props.estimateDate || undefined;
    response.statusCode = props.statusCode;
    response.localApprovalBy = props.localApprovalBy || undefined;
    response.localApprovalDate = props.localApprovalDate || undefined;
    response.sendOprBy = props.sendOprBy || undefined;
    response.sendOprDate = props.sendOprDate || undefined;
    response.approvalBy = props.approvalBy || undefined;
    response.approvalDate = props.approvalDate || undefined;
    response.cancelBy = props.cancelBy || undefined;
    response.cancelDate = props.cancelDate || undefined;
    response.isOprCancel = props.isOprCancel || undefined;
    response.reqActiveBy = props.reqActiveBy || undefined;
    response.reqActiveDate = props.reqActiveDate || undefined;
    response.altEstimateNo = props.altEstimateNo || undefined;
    response.noteEstimate = props.noteEstimate || undefined;
    response.note = props.note || undefined;

    // additional props
    response.totalEstimateValue = props.totalEstimateValue;
    response.estimateDetailCount = props.estimateDetailCount;
    response.localApprovalEstimateCount = props.localApprovalEstimateCount;
    response.operationApprovalEstimateCount =
      props.operationApprovalEstimateCount;
    response.operationRejectedEstimateCount =
      props.operationRejectedEstimateCount;
    response.rejectedEstimateCount = props.rejectedEstimateCount;

    return response;
  }
}
