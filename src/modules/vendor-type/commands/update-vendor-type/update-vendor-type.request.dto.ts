import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateVendorTypeRequestDto {
  @ApiPropertyOptional({
    example: 'D',
    description: 'MÃ LOẠI NHÀ THẦU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  vendorTypeCode: string;

  @ApiPropertyOptional({
    example: 'Delivery',
    description: 'TÊN LOẠI NHÀ THẦU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  vendorTypeName: string;

  @ApiPropertyOptional({
    example: 'Siêu nhanh, siêu gọn, siêu lẹ, siêu an toàn, siêu rẻ',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
