import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConditionReeferResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG VỎ',
  })
  conditionCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG MÁY',
  })
  conditionMachineCode: string;

  @ApiProperty({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  isDamage: boolean;

  @ApiProperty({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  mappingCode: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  note?: string | null;
}
