import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ManageRepairContainerResponseDto {
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
    example: false,
    description: 'giám định lại',
  })
  isRevice?: boolean;

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
    description: 'Ngày hoàn tất',
  })
  completeDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'Người hoàn tất',
  })
  completeBy?: string;

  @ApiPropertyOptional({
    example: 'ghi chú giám định',
    description: '',
  })
  noteSurvey?: string;

  @ApiPropertyOptional({
    example: 'ghi chú báo giá',
    description: '',
  })
  noteEstimate?: string;

  @ApiProperty({
    example: 'B',
    description: 'phân loại container',
  })
  conditionCode: string;

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

  @ApiPropertyOptional({
    example: 50,
    description: 'Total',
  })
  total?: Prisma.Decimal;

  @ApiPropertyOptional({
    example: 'YARD',
    description: 'yard',
  })
  yardCode?: string;
}
