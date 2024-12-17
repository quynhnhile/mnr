import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateContainerRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(200)
  idTos?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  idCont?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(200)
  idContTos?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(100)
  vesselKey: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(20)
  vesselImvoy?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(20)
  vesselExvoy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  eta?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  etb?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  etd?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  bargeInKey?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  bargeOutKey?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  deliveryOrder?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  blNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  bookingNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  houseBillNo?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(20)
  containerNo: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(50)
  classCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(10)
  fe: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(50)
  containerStatusCode: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(50)
  cargoTypeCode: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(500)
  commodity?: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(10)
  localSizeType: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(10)
  isoSizeType: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(5)
  isLocalForeign: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  jobModeCodeIn?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  methodCodeIn?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  dateIn?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(200)
  jobModeCodeOut?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  methodCodeOut?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  dateOut?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  requireSurveyDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: '',
  })
  @IsOptional()
  @IsDateString()
  repairMoveDate?: Date;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  eirInNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  eirOutNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  stuffNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  unstuffNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  serviceNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  draftNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  invoiceNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ KHU VỰC',
  })
  @IsOptional()
  @MaxLength(50)
  zoneCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ ĐƠN VỊ',
  })
  @IsOptional()
  @MaxLength(50)
  yardCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ BÃI',
  })
  @IsOptional()
  @MaxLength(50)
  lineCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  block?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  bay?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  row?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  tier?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  area?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  @IsNotEmpty()
  @IsBoolean()
  vgm: boolean;

  @ApiPropertyOptional({
    example: 840,
    description: '',
  })
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value ?? 1)
  mcWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 450,
    description: '',
  })
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value ?? 1)
  tareWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 215,
    description: '',
  })
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value ?? 1)
  maxGrossWeight?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  sealNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  sealNo1?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  sealNo2?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  pol?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  pod?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  fpod?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  transitCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(5)
  transitPort?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(10)
  temperature?: string;

  @ApiPropertyOptional({
    example: 840,
    description: '',
  })
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => value ?? 1)
  vent?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(10)
  ventUnit?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  @IsNotEmpty()
  @IsBoolean()
  cusHold: boolean;

  @ApiProperty({
    example: false,
    description: '',
  })
  @IsNotEmpty()
  @IsBoolean()
  terHold: boolean;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(500)
  terHoldReason?: string;

  @ApiProperty({
    example: false,
    description: '',
  })
  @IsNotEmpty()
  @IsBoolean()
  isSpecialWarning: boolean;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  specialWarning?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'TÌNH TRẠNG CONT',
  })
  @IsOptional()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'FS',
    description: 'PHÂN LOẠI CONT',
  })
  @IsOptional()
  @MaxLength(50)
  classifyCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(50)
  conditionMachineCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(1)
  isTruckBarge?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(10)
  truckNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(10)
  romoocNo?: string;

  @ApiProperty({
    example: 0,
    description:
      'LOẠI CONTAINER (0: cont thường, 1: cont flatrack, 2: cont flatrack xả bó)',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsIn([0, 1, 2])
  @Transform(({ value }) => value ?? 0)
  isBundled?: number;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ CONT MASTER CỦA BUNDLE',
  })
  @IsOptional()
  @MaxLength(20)
  containerNoMaster?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  noteCont?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  noteDamage?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  noteSpecialHandling?: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
