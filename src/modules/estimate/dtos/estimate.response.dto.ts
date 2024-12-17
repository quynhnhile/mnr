import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstimateResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '1',
    description: 'ID - DT_REPAIR_CONT',
  })
  idRef: string;

  @ApiProperty({
    example: 'CMAU1234567',
    description: 'CONTAINER ID',
  })
  idCont: string;

  @ApiProperty({
    example: '123456',
    description: 'CONTAINER NO',
  })
  containerNo: string;

  @ApiProperty({
    example: '202409186859',
    description: 'ESTIMATE NO - AUTO GENERATED WHEN CREATING',
  })
  estimateNo: string;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'ESTIMATE BY',
  })
  estimateBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'ESTIMATE DATE',
  })
  estimateDate?: Date;

  @ApiProperty({
    example: 'E',
    description: 'TRẠNG THÁI',
  })
  statusCode: string;

  @ApiPropertyOptional({
    example: 'user local test',
    description: 'LOCAL APPROVAL BY',
  })
  localApprovalBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'LOCAL APPROVAL DATE',
  })
  localApprovalDate?: Date;

  @ApiPropertyOptional({
    example: 'user opr test',
    description: 'SEND OPR BY',
  })
  sendOprBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'SEND OPR DATE',
  })
  sendOprDate?: Date;

  @ApiPropertyOptional({
    example: 'user test',
    description: 'APPROVAL BY',
  })
  approvalBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'APPROVAL DATE',
  })
  approvalDate?: Date;

  @ApiPropertyOptional({
    example: 'user test 1',
    description: 'CANCEL BY',
  })
  cancelBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'CANCEL DATE',
  })
  cancelDate?: Date;

  @ApiPropertyOptional({
    example: false,
    description: 'OPR CANCEL',
  })
  isOprCancel?: boolean;

  @ApiPropertyOptional({
    example: 'user test 2',
    description: 'REQ ACTIVE BY',
  })
  reqActiveBy?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'REQ ACTIVE DATE',
  })
  reqActiveDate?: Date;

  @ApiPropertyOptional({
    example: '202409186859',
    description: 'ESTIMATE NO - ALT',
  })
  altEstimateNo?: string;

  @ApiPropertyOptional({
    example: 'estimate note',
    description: 'NOTE ESTIMATE',
  })
  noteEstimate?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  note?: string;

  // additional properties
  @ApiPropertyOptional({
    example: 1_500_000,
    description: 'TOTAL ESTIMATE VALUE',
  })
  totalEstimateValue?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ESTIMATE DETAIL COUNT',
  })
  estimateDetailCount?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'LOCAL APPROVAL ESTIMATE COUNT',
  })
  localApprovalEstimateCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'OPERATION APPROVAL ESTIMATE COUNT',
  })
  operationApprovalEstimateCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'OPERATION REJECTED ESTIMATE COUNT',
  })
  operationRejectedEstimateCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'REJECTED ESTIMATE COUNT',
  })
  rejectedEstimateCount?: number;
}
