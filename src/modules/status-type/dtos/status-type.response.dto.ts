import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatusTypeResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI',
  })
  statusTypeCode: string;

  @ApiProperty({
    example: 'SỬA CHỮA',
    description: 'TÊN LOẠI TRẠNG THÁI',
  })
  statusTypeName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'GHI CHÚ',
  })
  note?: string;
}
