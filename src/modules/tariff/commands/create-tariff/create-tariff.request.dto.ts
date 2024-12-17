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
import { TariffUnit } from '@modules/tariff/domain/tariff.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTariffRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'TRF001',
    description: 'Mã nhóm biểu cước',
  })
  @IsNotEmpty()
  groupTrfCode: string;

  @ApiProperty({
    example: 'COMP001',
    description: 'Mã bộ phận cont',
  })
  @IsNotEmpty()
  @MaxLength(50)
  compCode: string;

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

  @ApiProperty({
    example: 'REP001',
    description: 'Mã sửa chữa cont',
  })
  @IsNotEmpty()
  @MaxLength(50)
  repCode: string;

  @ApiProperty({
    example: 12,
    description: 'Chiều dài',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({
    example: 12,
    description: 'Chiều rộng',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({
    example: 'Q',
    description: 'Đơn vị tính',
    enum: TariffUnit,
  })
  @IsNotEmpty()
  @IsEnum(TariffUnit)
  unit: string;

  @ApiProperty({
    example: 1,
    description: 'Số lượng',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'Số giờ',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  hours: number;

  @ApiProperty({
    example: 'VND',
    description: 'Tiền tệ',
  })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    example: 1_000_000,
    description: 'Đơn giá',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  mateAmount: number;

  @ApiProperty({
    example: 1_000_000,
    description: 'Tổng tiền',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({
    example: 0.1,
    description: 'Thuế VAT (%)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  vat?: number | null;

  @ApiProperty({
    example: false,
    description: 'Bao gồm VAT',
  })
  @IsBoolean()
  includeVat: boolean;

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
