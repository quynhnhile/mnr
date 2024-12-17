import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorTypeRequestDto {
  @ApiProperty({
    example: 'C',
    description: 'MÃ LOẠI NHÀ THẦU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  vendorTypeCode: string;

  @ApiProperty({
    example: 'CLEAN',
    description: 'TÊN LOẠI NHÀ THẦU',
  })
  @IsNotEmpty()
  @MaxLength(200)
  vendorTypeName: string;

  @ApiPropertyOptional({
    example:
      'Siêu sạch, siêu bóng, siêu sáng, siêu trắng, siêu trong, siêu thông, siêu đẹp',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
