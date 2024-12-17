import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DamageLocalResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'CK',
    description: 'MÃ HƯ HỎNG NỘI BỘ CONTAINER',
  })
  damLocalCode: string;

  @ApiProperty({
    example: 'CRACKER',
    description: 'TÊN TIẾNG ANH',
  })
  damLocalNameEn: string;

  @ApiPropertyOptional({
    example: 'NỨT',
    description: 'TÊN TIẾNG VIỆT',
  })
  damLocalNameVi?: string | null;

  @ApiPropertyOptional({
    example: 'GHI CHÚ HƯ HỎNG',
    description: 'GHI CHÚ',
  })
  note?: string | null;
}
