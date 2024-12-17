import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'CODE LOCATION 1',
    description: 'MÃ VỊ TRÍ CONTAINER',
  })
  locCode: string;

  @ApiProperty({
    example: 'NAME LOCATION 1',
    description: 'TÊN TIẾNG ANH',
  })
  locNameEn: string;

  @ApiPropertyOptional({
    example: 'TÊN VỊ TRÍ CONTAINER 1',
    description: 'TÊN TIẾNG VIỆT',
  })
  locNameVi?: string;

  @ApiPropertyOptional({
    example: 'RIGHT',
    description: 'MẶT LẮP RÁP',
  })
  side?: string;

  @ApiPropertyOptional({
    example: '20',
    description: 'SIZE',
  })
  size?: number;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  note?: string;
}
