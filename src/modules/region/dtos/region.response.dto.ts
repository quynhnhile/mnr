import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegionResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'S',
    description: 'MÃ VÙNG MIỀN',
  })
  regionCode: string;

  @ApiProperty({
    example: 'Miền Nam',
    description: 'TÊN VÙNG MIỀN',
  })
  regionName: string;

  @ApiPropertyOptional({
    example: 'Miền Nam',
    description: 'GHI CHÚ',
  })
  note?: string;

  @ApiPropertyOptional({
    example: '99',
    description: 'SẮP XẾP',
  })
  sort: number;
}
