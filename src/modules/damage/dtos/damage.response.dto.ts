import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DamageResponseDto extends ResponseBase<any> {
  @ApiPropertyOptional({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode?: string;

  @ApiProperty({
    example: 'CK',
    description: 'MÃ HƯ HỎNG CONTAINER',
  })
  damCode: string;

  @ApiProperty({
    example: 'CRACKER',
    description: 'TÊN TIẾNG ANH',
  })
  damNameEn: string;

  @ApiPropertyOptional({
    example: 'NỨT',
    description: 'TÊN TIẾNG VIỆT',
  })
  damNameVi?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ HƯ HỎNG',
    description: 'GHI CHÚ',
  })
  note?: string;
}
