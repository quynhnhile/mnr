import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SymbolResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: 'MÃ PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  symbolCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  symbolName: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  note?: string;
}
