import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ContainerResponseDto extends ResponseBase<any> {
  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  idTos?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  idCont?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  idContTos?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  vesselKey: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  vesselImvoy?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  vesselExvoy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  eta?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  etb?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  etd?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  bargeInKey?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  bargeOutKey?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  deliveryOrder?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  blNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  bookingNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  houseBillNo?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  containerNo: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  classCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  operationCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  fe: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  containerStatusCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  cargoTypeCode: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  commodity?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  localSizeType: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  isoSizeType: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  isLocalForeign: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  jobModeCodeIn?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  methodCodeIn?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  dateIn?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  jobModeCodeOut?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  methodCodeOut?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  dateOut?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  requireSurveyDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  repairMoveDate?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  eirInNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  eirOutNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  stuffNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  unstuffNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  serviceNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  draftNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  invoiceNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ KHU VỰC',
  })
  zoneCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ ĐƠN VỊ',
  })
  yardCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ BÃI',
  })
  lineCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  block?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  bay?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  row?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  tier?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  area?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  vgm: boolean;

  @ApiPropertyOptional({
    example: 840,
    description: '',
  })
  mcWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 450,
    description: '',
  })
  tareWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 215,
    description: '',
  })
  maxGrossWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  sealNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  sealNo1?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  sealNo2?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  pol?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  pod?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  fpod?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  transitCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  transitPort?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  temperature?: string;

  @ApiPropertyOptional({
    example: 840,
    description: '',
  })
  vent?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  ventUnit?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  cusHold: boolean;

  @ApiProperty({
    example: false,
    description: '',
  })
  terHold: boolean;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  terHoldReason?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  isSpecialWarning: boolean;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  specialWarning?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'TÌNH TRẠNG CONT',
  })
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'FS',
    description: 'PHÂN LOẠI CONT',
  })
  classifyCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  isTruckBarge?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  truckNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  romoocNo?: string;

  @ApiPropertyOptional({
    example: 0,
    description:
      'LOẠI CONTAINER (0: cont thường, 1: cont flatrack, 2: cont flatrack xả bó)',
  })
  isBundled?: number;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ CONT MASTER CỦA BUNDLE',
  })
  containerNoMaster?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  noteCont?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  noteDamage?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  noteSpecialHandling?: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  note?: string;
}
