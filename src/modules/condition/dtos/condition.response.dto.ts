import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConditionResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ TÌNH TRẠNG CONTAINER',
  })
  conditionCode: string;

  @ApiProperty({
    example: 'Available',
    description: 'TÊN TÌNH TRẠNG CONTAINER',
  })
  conditionName: string;

  @ApiProperty({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  isDamage: boolean;

  @ApiProperty({
    example: false,
    description: 'CONTAINER LẠNH',
  })
  isMachine: boolean;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  mappingCode?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  note: string | null;
}
