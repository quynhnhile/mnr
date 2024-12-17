import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ReportCleaningAndRepairResponseDto {
  @ApiProperty({
    example: 'DFSU7723129',
    description: 'Số Contanier',
  })
  containerNo: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'Ngày vào bãi',
  })
  dateIn?: Date;

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
    description: 'Ngày duyệt nội bộ',
  })
  localApprovalDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người duyệt nội bộ',
  })
  localApprovalBy?: string;

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
    description: 'Ngày hoàn tất',
  })
  completeDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người hoàn tất',
  })
  completeBy?: string;

  @ApiProperty({
    example: '2200',
    description: 'Kích cỡ nội bộ',
  })
  localSizeType: string;

  @ApiProperty({
    example: 'MSC',
    description: 'Chủ kt',
  })
  operationCode: string;

  @ApiProperty({
    example: 'E2411010004',
    description: 'Số báo giá',
  })
  estimateNo: string;

  @ApiProperty({
    example: false,
    description: 'is clean',
  })
  isClean: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Hours',
  })
  hours?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 50,
    description: 'Total',
  })
  total?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 'O',
    description: 'Loại đối tượng thanh toán',
  })
  payerCode?: string;

  @ApiPropertyOptional({
    example: 'YARD',
    description: 'yard',
  })
  yardCode?: string;
}
