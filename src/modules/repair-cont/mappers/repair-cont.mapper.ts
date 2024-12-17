import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { RepairCont as RepairContModel } from '@prisma/client';
import { RepairContEntity } from '../domain/repair-cont.entity';
import { RepairContResponseDto } from '../dtos/repair-cont.response.dto';

@Injectable()
export class RepairContMapper
  implements Mapper<RepairContEntity, RepairContModel, RepairContResponseDto>
{
  toPersistence(entity: RepairContEntity): RepairContModel {
    const copy = entity.getProps();
    const record: RepairContModel = {
      id: copy.id,
      // Map entity properties to record
      idCont: copy.idCont,
      containerNo: copy.containerNo,
      operationCode: copy.operationCode,
      pinCode: copy.pinCode || null,
      orderNo: copy.orderNo || null,
      bookingNo: copy.bookingNo || null,
      blNo: copy.blNo || null,
      location: copy.location || null,
      localSizeType: copy.localSizeType,
      isoSizeType: copy.isoSizeType,
      conditionCode: copy.conditionCode || null,
      classifyCode: copy.classifyCode || null,
      conditionMachineCode: copy.conditionMachineCode || null,
      conditionCodeAfter: copy.conditionCodeAfter || null,
      conditionMachineCodeAfter: copy.conditionMachineCodeAfter || null,
      factoryDate: copy.factoryDate || null,
      statusCode: copy.statusCode,
      surveyInNo: copy.surveyInNo || null,
      surveyOutNo: copy.surveyOutNo || null,
      estimateNo: copy.estimateNo || null,
      isComplete: copy.isComplete || null,
      completeDate: copy.completeDate || null,
      completeBy: copy.completeBy || null,
      billCheck: copy.billCheck || null,
      billDate: copy.billDate || null,
      billOprConfirm: copy.billOprConfirm || null,
      billOprReason: copy.billOprReason || null,
      isPosted: copy.isPosted || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: RepairContModel): RepairContEntity {
    return new RepairContEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idCont: record.idCont,
        containerNo: record.containerNo,
        operationCode: record.operationCode,
        pinCode: record.pinCode || null,
        orderNo: record.orderNo || null,
        bookingNo: record.bookingNo || null,
        blNo: record.blNo || null,
        location: record.location || null,
        localSizeType: record.localSizeType,
        isoSizeType: record.isoSizeType,
        conditionCode: record.conditionCode || null,
        classifyCode: record.classifyCode || null,
        conditionMachineCode: record.conditionMachineCode || null,
        conditionCodeAfter: record.conditionCodeAfter || null,
        conditionMachineCodeAfter: record.conditionMachineCodeAfter || null,
        factoryDate: record.factoryDate || null,
        statusCode: record.statusCode,
        surveyInNo: record.surveyInNo || null,
        surveyOutNo: record.surveyOutNo || null,
        estimateNo: record.estimateNo || null,
        isComplete: record.isComplete || null,
        completeDate: record.completeDate || null,
        completeBy: record.completeBy || null,
        billCheck: record.billCheck || null,
        billDate: record.billDate || null,
        billOprConfirm: record.billOprConfirm || null,
        billOprReason: record.billOprReason || null,
        isPosted: record.isPosted || null,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: RepairContEntity): RepairContResponseDto {
    const props = entity.getProps();
    const response = new RepairContResponseDto(entity);
    // Map entity properties to response DTO
    response.idCont = props.idCont;
    response.containerNo = props.containerNo;
    response.operationCode = props.operationCode;
    response.pinCode = props.pinCode || undefined;
    response.orderNo = props.orderNo || undefined;
    response.bookingNo = props.bookingNo || undefined;
    response.blNo = props.blNo || undefined;
    response.location = props.location || undefined;
    response.localSizeType = props.localSizeType;
    response.isoSizeType = props.isoSizeType;
    response.conditionCode = props.conditionCode || undefined;
    response.classifyCode = props.classifyCode || undefined;
    response.conditionMachineCode = props.conditionMachineCode || undefined;
    response.conditionCodeAfter = props.conditionCodeAfter || undefined;
    response.conditionMachineCodeAfter =
      props.conditionMachineCodeAfter || undefined;
    response.factoryDate = props.factoryDate || undefined;
    response.statusCode = props.statusCode;
    response.surveyInNo = props.surveyInNo || undefined;
    response.surveyOutNo = props.surveyOutNo || undefined;
    response.estimateNo = props.estimateNo || undefined;
    response.isComplete = props.isComplete || undefined;
    response.completeDate = props.completeDate || undefined;
    response.completeBy = props.completeBy || undefined;
    response.billCheck = props.billCheck || undefined;
    response.billDate = props.billDate || undefined;
    response.billOprConfirm = props.billOprConfirm || undefined;
    response.billOprReason = props.billOprReason || undefined;
    response.isPosted = props.isPosted || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
