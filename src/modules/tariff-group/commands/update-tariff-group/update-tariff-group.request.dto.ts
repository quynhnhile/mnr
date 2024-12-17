import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTariffGroupRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'TRF_GR_001',
    description: 'Mã nhóm biểu cước',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  groupTrfCode: string;

  @ApiPropertyOptional({
    example: 'Biểu cước nhóm 1',
    description: 'Tên nhóm biểu cước',
  })
  @IsOptional()
  @MaxLength(200)
  groupTrfName?: string | null;

  @ApiPropertyOptional({
    example: 1.5,
    description: 'Giá trị labor',
  })
  @IsOptionalNonNullable()
  @IsNumber()
  laborRate: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Loại container Dry',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isDry: boolean;

  @ApiProperty({
    example: true,
    description: 'Loại container Reefer',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isReefer: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Loại container Tank',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isTank: boolean;

  @ApiPropertyOptional({
    example: ['OPR_001'],
    description: 'Mã hãng khai thác',
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  operationCode?: string[] | null;

  @ApiPropertyOptional({
    example: 'VDR_001',
    description: 'Mã đơn vị nhà thầu',
  })
  @IsOptional()
  @MaxLength(50)
  vendorCode?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Đánh dấu biểu cước nội bộ Cảng/ICD/Depot',
  })
  @IsOptional()
  @IsBoolean()
  isTerminal?: boolean | null;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string | null;
}
