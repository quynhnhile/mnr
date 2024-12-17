import { ResponseBase } from '@libs/api/response.base';
import { EstimateItemStatus } from '@modules/estimate/domain/estimate.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobRepairCleanResponseDto } from '@src/modules/job-repair-clean/dtos/job-repair-clean.response.dto';

export class EstimateDetailResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: '1',
    description: 'ID of the estimate',
  })
  idEstimate: string;

  @ApiProperty({
    example: 'E2409190001',
    description: 'Number of the estimate',
  })
  estimateNo: string;

  @ApiProperty({
    example: 'C01',
    description: 'Component code',
  })
  compCode: string;

  @ApiPropertyOptional({
    example: 'L01',
    description: 'Location code',
  })
  locCode?: string | null;

  @ApiPropertyOptional({
    example: 'D01',
    description: 'Damage code',
  })
  damCode?: string | null;

  @ApiProperty({
    example: 'R01',
    description: 'Repair code',
  })
  repCode: string;

  @ApiProperty({
    example: 10,
    description: 'Length',
  })
  length: number;

  @ApiProperty({
    example: 10,
    description: 'Width',
  })
  width: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity',
  })
  quantity: number;

  @ApiPropertyOptional({
    example: 'L',
    description: 'Unit',
  })
  unit?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Hours',
  })
  hours?: number;

  @ApiPropertyOptional({
    example: 'CWO',
    description: 'CWO',
  })
  cwo?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Labor rate',
  })
  laborRate?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Labor price',
  })
  laborPrice?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Material price',
  })
  matePrice?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Total',
  })
  total?: number;

  @ApiPropertyOptional({
    example: 'VND',
    description: 'Currency',
  })
  currency?: string;

  @ApiProperty({
    example: 'P01',
    description: 'Payer code',
  })
  payerCode: string;

  @ApiProperty({
    example: 'P01',
    description: 'Symbol code',
  })
  symbolCode: string;

  @ApiProperty({
    example: 10,
    description: 'Rate',
  })
  rate: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Is clean',
  })
  isClean?: boolean;

  @ApiPropertyOptional({
    example: 'CM01',
    description: 'Clean method code',
  })
  cleanMethodCode?: string | null;

  @ApiPropertyOptional({
    example: 'CM01',
    description: 'Clean mode code',
  })
  cleanModeCode?: string | null;

  @ApiProperty({
    example: EstimateItemStatus.APPROVAL,
    description: 'Status code',
    enum: EstimateItemStatus,
  })
  statusCode: string;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Local approval date',
  })
  localApprovalDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Local approval by',
  })
  localApprovalBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Approval date',
  })
  approvalDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Approval by',
  })
  approvalBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Request active date',
  })
  reqActiveDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Request active by',
  })
  reqActiveBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Send opr date',
  })
  sendOprDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Send opr by',
  })
  sendOprBy?: string | null;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Cancel date',
  })
  cancelDate?: Date | null;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Cancel by',
  })
  cancelBy?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Is operation cancel',
  })
  isOprCancel?: boolean | null;

  @ApiPropertyOptional({
    example: 'Note',
    description: 'Note',
  })
  note?: string;

  @ApiProperty({
    type: JobRepairCleanResponseDto,
    isArray: true,
    example: [],
    description: 'DANH SÁCH HIỆN TRƯỜNG SỬA CHỮA - VỆ SINH',
  })
  jobRepairCleans: JobRepairCleanResponseDto[];
}
