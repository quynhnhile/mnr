import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Container as ContainerModel } from '@prisma/client';
import { ContainerEntity } from '../domain/container.entity';
import { ContainerResponseDto } from '../dtos/container.response.dto';
@Injectable()
export class ContainerMapper
  implements Mapper<ContainerEntity, ContainerModel, ContainerResponseDto>
{
  toPersistence(entity: ContainerEntity): ContainerModel {
    const copy = entity.getProps();
    const record: ContainerModel = {
      id: copy.id,
      idTos: copy.idTos || null,
      idCont: copy.idCont || null,
      idContTos: copy.idContTos || null,
      vesselKey: copy.vesselKey,
      vesselImvoy: copy.vesselImvoy || null,
      vesselExvoy: copy.vesselExvoy || null,
      eta: copy.eta || null,
      etb: copy.etb || null,
      etd: copy.etd || null,
      bargeInKey: copy.bargeInKey || null,
      bargeOutKey: copy.bargeOutKey || null,
      deliveryOrder: copy.deliveryOrder || null,
      blNo: copy.blNo || null,
      bookingNo: copy.bookingNo || null,
      houseBillNo: copy.houseBillNo || null,
      containerNo: copy.containerNo,
      classCode: copy.classCode,
      operationCode: copy.operationCode,
      fe: copy.fe,
      containerStatusCode: copy.containerStatusCode,
      cargoTypeCode: copy.cargoTypeCode,
      commodity: copy.commodity || null,
      localSizeType: copy.localSizeType,
      isoSizeType: copy.isoSizeType,
      isLocalForeign: copy.isLocalForeign,
      jobModeCodeIn: copy.jobModeCodeIn || null,
      methodCodeIn: copy.methodCodeIn || null,
      dateIn: copy.dateIn || null,
      jobModeCodeOut: copy.jobModeCodeOut || null,
      methodCodeOut: copy.methodCodeOut || null,
      dateOut: copy.dateOut || null,
      requireSurveyDate: copy.requireSurveyDate || null,
      repairMoveDate: copy.repairMoveDate || null,
      eirInNo: copy.eirInNo || null,
      eirOutNo: copy.eirOutNo || null,
      stuffNo: copy.stuffNo || null,
      unstuffNo: copy.unstuffNo || null,
      serviceNo: copy.serviceNo || null,
      draftNo: copy.draftNo || null,
      invoiceNo: copy.invoiceNo || null,
      zoneCode: copy.zoneCode || null,
      yardCode: copy.yardCode || null,
      lineCode: copy.lineCode || null,
      block: copy.block || null,
      bay: copy.bay || null,
      row: copy.row || null,
      tier: copy.tier || null,
      area: copy.area || null,
      vgm: copy.vgm,
      mcWeight: copy.mcWeight || null,
      tareWeight: copy.tareWeight || null,
      maxGrossWeight: copy.maxGrossWeight || null,
      sealNo: copy.sealNo || null,
      sealNo1: copy.sealNo1 || null,
      sealNo2: copy.sealNo2 || null,
      pol: copy.pol || null,
      pod: copy.pod || null,
      fpod: copy.fpod || null,
      transitCode: copy.transitCode || null,
      transitPort: copy.transitPort || null,
      temperature: copy.temperature || null,
      vent: copy.vent || null,
      ventUnit: copy.ventUnit || null,
      cusHold: copy.cusHold,
      terHold: copy.terHold,
      terHoldReason: copy.terHoldReason || null,
      isSpecialWarning: copy.isSpecialWarning,
      specialWarning: copy.specialWarning || null,
      conditionCode: copy.conditionCode || null,
      classifyCode: copy.classifyCode || null,
      conditionMachineCode: copy.conditionMachineCode || null,
      isTruckBarge: copy.isTruckBarge || null,
      truckNo: copy.truckNo || null,
      romoocNo: copy.romoocNo || null,
      isBundled: copy.isBundled || null,
      containerNoMaster: copy.containerNoMaster || null,
      noteCont: copy.noteCont || null,
      noteDamage: copy.noteDamage || null,
      noteSpecialHandling: copy.noteSpecialHandling || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toPersistenceFromRaw(copy: any): ContainerModel {
    const record: ContainerModel = {
      id: copy.id,
      idTos: copy.id_tos || null,
      idCont: copy.id_cont || null,
      idContTos: copy.id_cont_tos || null,
      vesselKey: copy.vessel_key,
      vesselImvoy: copy.vessel_imvoy || null,
      vesselExvoy: copy.vessel_exvoy || null,
      eta: copy.eta || null,
      etb: copy.etb || null,
      etd: copy.etd || null,
      bargeInKey: copy.barge_in_key || null,
      bargeOutKey: copy.barge_out_key || null,
      deliveryOrder: copy.delivery_order || null,
      blNo: copy.bl_no || null,
      bookingNo: copy.booking_no || null,
      houseBillNo: copy.house_bill_no || null,
      containerNo: copy.container_no,
      classCode: copy.class_code,
      operationCode: copy.operation_code,
      fe: copy.fe,
      containerStatusCode: copy.container_status_code,
      cargoTypeCode: copy.cargo_type_code,
      commodity: copy.commodity || null,
      localSizeType: copy.local_size_type,
      isoSizeType: copy.iso_size_type,
      isLocalForeign: copy.is_local_foreign,
      jobModeCodeIn: copy.job_mode_code_in || null,
      methodCodeIn: copy.method_code_in || null,
      dateIn: copy.date_in || null,
      jobModeCodeOut: copy.job_mode_code_out || null,
      methodCodeOut: copy.method_code_out || null,
      dateOut: copy.date_out || null,
      requireSurveyDate: copy.require_survey_date || null,
      repairMoveDate: copy.repair_move_date || null,
      eirInNo: copy.eir_in_no || null,
      eirOutNo: copy.eir_out_no || null,
      stuffNo: copy.stuff_no || null,
      unstuffNo: copy.unstuff_no || null,
      serviceNo: copy.service_no || null,
      draftNo: copy.draft_no || null,
      invoiceNo: copy.invoice_no || null,
      zoneCode: copy.zone_code || null,
      yardCode: copy.yard_code || null,
      lineCode: copy.line_code || null,
      block: copy.block || null,
      bay: copy.bay || null,
      row: copy.row || null,
      tier: copy.tier || null,
      area: copy.area || null,
      vgm: copy.vgm,
      mcWeight: copy.mc_weight || null,
      tareWeight: copy.tare_weight || null,
      maxGrossWeight: copy.max_gross_weight || null,
      sealNo: copy.seal_no || null,
      sealNo1: copy.seal_no1 || null,
      sealNo2: copy.seal_no2 || null,
      pol: copy.pol || null,
      pod: copy.pod || null,
      fpod: copy.fpod || null,
      transitCode: copy.transit_code || null,
      transitPort: copy.transit_port || null,
      temperature: copy.temperature || null,
      vent: copy.vent || null,
      ventUnit: copy.vent_unit || null,
      cusHold: copy.cus_hold,
      terHold: copy.ter_hold,
      terHoldReason: copy.ter_hold_reason || null,
      isSpecialWarning: copy.is_special_warning,
      specialWarning: copy.special_warning || null,
      conditionCode: copy.condition_code || null,
      classifyCode: copy.classify_code || null,
      conditionMachineCode: copy.condition_machine_code || null,
      isTruckBarge: copy.is_truck_barge || null,
      truckNo: copy.truck_no || null,
      romoocNo: copy.romooc_no || null,
      isBundled: copy.is_bundled,
      containerNoMaster: copy.container_no_master || null,
      noteCont: copy.note_cont || null,
      noteDamage: copy.note_damage || null,
      noteSpecialHandling: copy.note_special_handling || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ContainerModel): ContainerEntity {
    return new ContainerEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        idTos: record.idTos || null,
        idCont: record.idCont || null,
        idContTos: record.idContTos || null,
        vesselKey: record.vesselKey,
        vesselImvoy: record.vesselImvoy || null,
        vesselExvoy: record.vesselExvoy || null,
        eta: record.eta || null,
        etb: record.etb || null,
        etd: record.etd || null,
        bargeInKey: record.bargeInKey || null,
        bargeOutKey: record.bargeOutKey || null,
        deliveryOrder: record.deliveryOrder || null,
        blNo: record.blNo || null,
        bookingNo: record.bookingNo || null,
        houseBillNo: record.houseBillNo || null,
        containerNo: record.containerNo,
        classCode: record.classCode,
        operationCode: record.operationCode,
        fe: record.fe,
        containerStatusCode: record.containerStatusCode,
        cargoTypeCode: record.cargoTypeCode,
        commodity: record.commodity || null,
        localSizeType: record.localSizeType,
        isoSizeType: record.isoSizeType,
        isLocalForeign: record.isLocalForeign,
        jobModeCodeIn: record.jobModeCodeIn || null,
        methodCodeIn: record.methodCodeIn || null,
        dateIn: record.dateIn || null,
        jobModeCodeOut: record.jobModeCodeOut,
        methodCodeOut: record.methodCodeOut || null,
        dateOut: record.dateOut || null,
        requireSurveyDate: record.requireSurveyDate || null,
        repairMoveDate: record.repairMoveDate || null,
        eirInNo: record.eirInNo || null,
        eirOutNo: record.eirOutNo || null,
        stuffNo: record.stuffNo || null,
        unstuffNo: record.unstuffNo || null,
        serviceNo: record.serviceNo || null,
        draftNo: record.draftNo || null,
        invoiceNo: record.invoiceNo || null,
        zoneCode: record.zoneCode || null,
        yardCode: record.yardCode || null,
        lineCode: record.lineCode || null,
        block: record.block || null,
        bay: record.bay || null,
        row: record.row || null,
        tier: record.tier || null,
        area: record.area || null,
        vgm: record.vgm,
        mcWeight: record.mcWeight || null,
        tareWeight: record.tareWeight || null,
        maxGrossWeight: record.maxGrossWeight || null,
        sealNo: record.sealNo || null,
        sealNo1: record.sealNo1 || null,
        sealNo2: record.sealNo2 || null,
        pol: record.pol || null,
        pod: record.pod || null,
        fpod: record.fpod || null,
        transitCode: record.transitCode || null,
        transitPort: record.transitPort || null,
        temperature: record.temperature || null,
        vent: record.vent || null,
        ventUnit: record.ventUnit || null,
        cusHold: record.cusHold,
        terHold: record.terHold,
        terHoldReason: record.terHoldReason || null,
        isSpecialWarning: record.isSpecialWarning,
        specialWarning: record.specialWarning || null,
        conditionCode: record.conditionCode || null,
        classifyCode: record.classifyCode || null,
        conditionMachineCode: record.conditionMachineCode || null,
        isTruckBarge: record.isTruckBarge || null,
        truckNo: record.truckNo || null,
        romoocNo: record.romoocNo || null,
        isBundled: record.isBundled || 0,
        containerNoMaster: record.containerNoMaster || null,
        noteCont: record.noteCont || null,
        noteDamage: record.noteDamage,
        noteSpecialHandling: record.noteSpecialHandling || null,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ContainerEntity): ContainerResponseDto {
    const props = entity.getProps();
    const response = new ContainerResponseDto(entity);
    response.idTos = props.idTos || undefined;
    response.idCont = props.idCont || undefined;
    response.idContTos = props.idContTos || undefined;
    response.vesselKey = props.vesselKey;
    response.vesselImvoy = props.vesselImvoy || undefined;
    response.vesselExvoy = props.vesselExvoy || undefined;
    response.eta = props.eta || undefined;
    response.etb = props.etb || undefined;
    response.etd = props.etd || undefined;
    response.bargeInKey = props.bargeInKey || undefined;
    response.bargeOutKey = props.bargeOutKey || undefined;
    response.deliveryOrder = props.deliveryOrder || undefined;
    response.blNo = props.blNo || undefined;
    response.bookingNo = props.bookingNo || undefined;
    response.houseBillNo = props.houseBillNo || undefined;
    response.containerNo = props.containerNo;
    response.classCode = props.classCode;
    response.operationCode = props.operationCode;
    response.fe = props.fe;
    response.containerStatusCode = props.containerStatusCode;
    response.cargoTypeCode = props.cargoTypeCode;
    response.commodity = props.commodity || undefined;
    response.localSizeType = props.localSizeType;
    response.isoSizeType = props.isoSizeType;
    response.isLocalForeign = props.isLocalForeign;
    response.jobModeCodeIn = props.jobModeCodeIn || undefined;
    response.methodCodeIn = props.methodCodeIn || undefined;
    response.dateIn = props.dateIn || undefined;
    response.jobModeCodeOut = props.jobModeCodeOut || undefined;
    response.methodCodeOut = props.methodCodeOut || undefined;
    response.dateOut = props.dateOut || undefined;
    response.requireSurveyDate = props.requireSurveyDate || undefined;
    response.repairMoveDate = props.repairMoveDate || undefined;
    response.eirInNo = props.eirInNo || undefined;
    response.eirOutNo = props.eirOutNo || undefined;
    response.stuffNo = props.stuffNo || undefined;
    response.unstuffNo = props.unstuffNo || undefined;
    response.serviceNo = props.serviceNo || undefined;
    response.draftNo = props.draftNo || undefined;
    response.invoiceNo = props.invoiceNo || undefined;
    response.zoneCode = props.zoneCode || undefined;
    response.yardCode = props.yardCode || undefined;
    response.lineCode = props.lineCode || undefined;
    response.block = props.block || undefined;
    response.bay = props.bay || undefined;
    response.row = props.row || undefined;
    response.tier = props.tier || undefined;
    response.area = props.area || undefined;
    response.vgm = props.vgm;
    response.mcWeight = props.mcWeight || undefined;
    response.tareWeight = props.tareWeight || undefined;
    response.maxGrossWeight = props.maxGrossWeight || undefined;
    response.sealNo = props.sealNo || undefined;
    response.sealNo1 = props.sealNo1 || undefined;
    response.sealNo2 = props.sealNo2 || undefined;
    response.pol = props.pol || undefined;
    response.pod = props.pod || undefined;
    response.fpod = props.fpod || undefined;
    response.transitCode = props.transitCode || undefined;
    response.transitPort = props.transitPort || undefined;
    response.temperature = props.temperature || undefined;
    response.vent = props.vent || undefined;
    response.ventUnit = props.ventUnit || undefined;
    response.cusHold = props.cusHold;
    response.terHold = props.terHold;
    response.terHoldReason = props.terHoldReason || undefined;
    response.isSpecialWarning = props.isSpecialWarning;
    response.specialWarning = props.specialWarning || undefined;
    response.conditionCode = props.conditionCode || undefined;
    response.classifyCode = props.classifyCode || undefined;
    response.conditionMachineCode = props.conditionMachineCode || undefined;
    response.isTruckBarge = props.isTruckBarge || undefined;
    response.truckNo = props.truckNo || undefined;
    response.romoocNo = props.romoocNo || undefined;
    response.isBundled = props.isBundled;
    response.containerNoMaster = props.containerNoMaster || undefined;
    response.noteCont = props.noteCont || undefined;
    response.noteDamage = props.noteDamage || undefined;
    response.noteSpecialHandling = props.noteSpecialHandling || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
