import { IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class QueryContByContNosResponseDto {
  @ApiProperty({
    example: 1,
    description: 'RepairCont ID',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'DFSU7723129',
    description: 'Số Contanier',
  })
  containerNo: string;

  @ApiProperty({
    example: 'MSC',
    description: 'Chủ kt',
  })
  operationCode: string;

  @ApiProperty({
    example: '2200',
    description: 'Kích cỡ nội bộ',
  })
  localSizeType: string;

  @ApiProperty({
    example: '45G0',
    description: 'Kích cỡ iso',
  })
  isoSizeType: string;

  @ApiProperty({
    example: 'AA',
    description: 'condition code',
  })
  conditionCode: string;

  @ApiProperty({
    example: 'AA',
    description: 'classify code',
  })
  classifyCode: string;

  @ApiProperty({
    example: 'E2411010004',
    description: 'Số báo giá',
  })
  estimateNo: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày vào bãi',
  })
  dateIn?: Date;

  @ApiPropertyOptional({
    example: 'ghi chú giám định',
    description: 'ghi chú giám định',
  })
  noteSurvey?: string;

  @ApiPropertyOptional({
    example: 'ghi chú báo giá',
    description: 'ghi chú báo giá',
  })
  noteEstimate?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày báo giá',
  })
  estimateDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người báo giá',
  })
  estimateBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày hãng tàu duyệt',
  })
  approvalDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người duyệt',
  })
  approvalBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày nội bộ duyệt',
  })
  localApprovalDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'nội bộ duyệt',
  })
  localApprovalBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày hoàn tất',
  })
  completeDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người hoàn tất',
  })
  completeBy?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Total',
  })
  total?: Prisma.Decimal;
}
