import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CleanModeResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'VSN',
    description: 'MÃ PHƯƠNG ÁN VỆ SINH',
  })
  cleanModeCode: string;

  @ApiProperty({
    example: 'VỆ SINH NƯỚC',
    description: 'TÊN PHƯƠNG ÁN VỆ SINH',
  })
  cleanModeName: string;

  @ApiPropertyOptional({
    example: 'ghi chú vệ sinh',
    description: 'GHI CHÚ',
  })
  note?: string;
}
