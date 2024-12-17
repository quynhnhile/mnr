import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TariffGroupResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'TRF_GR_001',
    description: 'Mã nhóm biểu cước',
  })
  groupTrfCode: string;

  @ApiProperty({
    example: 'Biểu cước nhóm 1',
    description: 'Tên nhóm biểu cước',
  })
  groupTrfName: string;

  @ApiProperty({
    example: 1.5,
    description: 'Giá trị labor',
  })
  laborRate: number;

  @ApiProperty({
    example: true,
    description: 'Loại container Dry',
  })
  isDry: boolean;

  @ApiProperty({
    example: true,
    description: 'Loại container Reefer',
  })
  isReefer: boolean;

  @ApiProperty({
    example: true,
    description: 'Loại container Tank',
  })
  isTank: boolean;

  @ApiProperty({
    example: ['OPR_001'],
    description: 'Mã hãng khai thác',
    type: 'string',
    isArray: true,
  })
  operationCode: string[];

  @ApiPropertyOptional({
    example: 'VDR_001',
    description: 'Mã đơn vị nhà thầu',
  })
  vendorCode?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Đánh dấu biểu cước nội bộ Cảng/ICD/Depot',
  })
  isTerminal?: boolean | null;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  note?: string | null;
}
