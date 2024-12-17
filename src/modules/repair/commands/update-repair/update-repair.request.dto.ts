import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRepairRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'Mã hãng tàu',
  })
  @IsOptional()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'CC',
    description: 'Mã sửa chữa',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  repCode?: string;

  @ApiPropertyOptional({
    example: 'Chemical clean',
    description: 'Tên tiếng Anh',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  repNameEn?: string;

  @ApiPropertyOptional({
    example: 'Rửa hóa chất',
    description: 'Tên tiếng Việt',
  })
  @IsOptional()
  @MaxLength(200)
  repNameVi?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Loại vệ sinh',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isClean?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Loại sửa chữa',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isRepair?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Loại kiểm tra PTI',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isPti?: boolean;

  @ApiPropertyOptional({
    example: '',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
