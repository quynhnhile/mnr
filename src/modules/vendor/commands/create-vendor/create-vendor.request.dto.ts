import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorRequestDto {
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ HÃNG KHAI KHÁC',
  })
  @IsOptional()
  @MaxLength(50)
  operationCode?: string;

  @ApiProperty({
    example: 'D',
    description: 'MÃ LOẠI BIỂU CƯỚC',
  })
  @IsNotEmpty()
  @MaxLength(50)
  vendorTypeCode: string;

  @ApiProperty({
    example: 'SD',
    description: 'MÃ NHÓM BIỂU CƯỚC',
  })
  @IsNotEmpty()
  @MaxLength(50)
  vendorCode: string;

  @ApiProperty({
    example: 'SNP DELIVERY',
    description: 'TÊN NHÓM BIỂU CƯỚC',
  })
  @IsNotEmpty()
  @MaxLength(200)
  vendorName: string;

  @ApiPropertyOptional({
    example: true,
    description: 'TRẠNG THÁI',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'SNP DELIVERY',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
