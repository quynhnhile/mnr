import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VendorTypeResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'S',
    description: 'MÃ VÙNG MIỀN',
  })
  vendorTypeCode: string;

  @ApiProperty({
    example: 'Miền Nam',
    description: 'TÊN VÙNG MIỀN',
  })
  vendorTypeName: string;

  @ApiPropertyOptional({
    example: 'Miền Nam',
    description: 'GHI CHÚ',
  })
  note?: string;
}
