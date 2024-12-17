import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComponentRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'Mã hãng tàu',
  })
  @IsOptional()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'DHR',
    description: 'Mã bộ phận',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  compCode?: string;

  @ApiPropertyOptional({
    example: 'DOOR HANDLE RETAINER',
    description: 'Tên tiếng Anh',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  compNameEn?: string;

  @ApiPropertyOptional({
    example: 'KHOA SEAL(PHAN TINH)',
    description: 'Tên tiếng Việt',
  })
  @IsOptional()
  @MaxLength(200)
  compNameVi?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Bộ phận lắp ráp',
  })
  @IsOptional()
  @MaxLength(200)
  assembly?: string;

  @ApiPropertyOptional({
    example: 'L',
    description: 'Mặt lắp ráp',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  side?: string;

  @ApiPropertyOptional({
    example: 'DRY',
    description: 'Loại container (Dry , Reefer , Tank)',
  })
  @IsOptional()
  @MaxLength(100)
  contType?: string;

  @ApiPropertyOptional({
    example: 'AL',
    description: 'Mã vật tư',
  })
  @IsOptional()
  @MaxLength(50)
  materialCode?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Phân biệt Vỏ máy (Cont lạnh)',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isMachine?: boolean;

  @ApiPropertyOptional({
    example: 'Note',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
