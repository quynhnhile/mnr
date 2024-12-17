import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CleanMethodResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'VSL',
    description: 'MÃ PHƯƠNG THỨC VỆ SINH',
  })
  cleanMethodCode: string;

  @ApiProperty({
    example: 'VỆ SINH LUMPSUM',
    description: 'TÊN PHƯƠNG THỨC VỆ SINH',
  })
  cleanMethodName: string;

  @ApiPropertyOptional({
    example: 'ghi chú vệ sinh',
    description: 'GHI CHÚ',
  })
  note?: string;
}
