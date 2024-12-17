import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassifyResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI CONTAINER',
  })
  classifyCode: string;

  @ApiProperty({
    example: 'TÊN PHÂN LOẠI CONTAINER',
    description: 'TÊN PHÂN LOẠI CONTAINER',
  })
  classifyName: string;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  mappingCode?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  note?: string;
}
