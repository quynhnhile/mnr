import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorRequestDto {
  @ApiPropertyOptional({
    example: 'S',
    description: 'MÃ HÃNG KHAI KHÁC',
  })
  @IsOptional()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'D',
    description: 'MÃ LOẠI BIỂU CƯỚC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  vendorTypeCode: string;

  @ApiPropertyOptional({
    example: 'SD',
    description: 'MÃ NHÓM BIỂU CƯỚC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  vendorCode: string;

  @ApiPropertyOptional({
    example: 'SNP DELIVERY',
    description: 'TÊN NHÓM BIỂU CƯỚC',
  })
  @IsNotEmpty()
  @MaxLength(200)
  vendorName?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'TRẠNG THÁI',
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'SNP DELIVERY',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
