import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { TariffUnit } from '@modules/tariff/domain/tariff.type';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTariffRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'TRF001',
    description: 'Mã nhóm biểu cước',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  groupTrfCode?: string;

  @ApiPropertyOptional({
    example: 'COMP001',
    description: 'Mã bộ phận cont',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  compCode?: string;

  @ApiPropertyOptional({
    example: ['LOC001'],
    description: 'Mã vị trí bộ phận cont',
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  locCode?: string[] | null;

  @ApiPropertyOptional({
    example: 'DAM001',
    description: 'Mã loại hư hỏng cont',
  })
  @IsOptional()
  @MaxLength(50)
  damCode?: string;

  @ApiPropertyOptional({
    example: 'REP001',
    description: 'Mã sửa chữa cont',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  repCode?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'Chiều dài',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  length?: number;

  @ApiPropertyOptional({
    example: 12,
    description: 'Chiều rộng',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  width?: number;

  @ApiPropertyOptional({
    example: 'Q',
    description: 'Đơn vị tính',
    enum: TariffUnit,
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsEnum(TariffUnit)
  unit?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Số lượng',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Số giờ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  hours?: number;

  @ApiPropertyOptional({
    example: 'VND',
    description: 'Tiền tệ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  currency?: string;

  @ApiPropertyOptional({
    example: 1_000_000,
    description: 'Đơn giá',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  mateAmount?: number;

  @ApiPropertyOptional({
    example: 1_000_000,
    description: 'Tổng tiền',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({
    example: 0.1,
    description: 'Thuế VAT (%)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  vat?: number | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Bao gồm VAT',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  includeVat?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Cách tính đơn giá theo bước nhảy',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  add?: number | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thêm giờ - Mô tả công thức tính Add Hours',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  addHours?: number | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thêm đơn giá Material - Mô tả công thức tính Add Material',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  addMate?: number | null;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú diễn giải biểu cước',
  })
  @IsOptional()
  note?: string | null;
}
