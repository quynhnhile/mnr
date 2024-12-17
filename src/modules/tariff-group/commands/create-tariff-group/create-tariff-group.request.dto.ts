import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTariffGroupRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'TRF_GR_001',
    description: 'Mã nhóm biểu cước',
  })
  @IsNotEmpty()
  @MaxLength(50)
  groupTrfCode: string;

  @ApiProperty({
    example: 'Biểu cước nhóm 1',
    description: 'Tên nhóm biểu cước',
  })
  @IsNotEmpty()
  @MaxLength(200)
  groupTrfName: string;

  @ApiProperty({
    example: 1.5,
    description: 'Giá trị labor',
  })
  @IsNumber()
  laborRate: number;

  @ApiProperty({
    example: true,
    description: 'Loại container Dry',
  })
  @IsBoolean()
  isDry: boolean;

  @ApiProperty({
    example: true,
    description: 'Loại container Reefer',
  })
  @IsBoolean()
  isReefer: boolean;

  @ApiProperty({
    example: true,
    description: 'Loại container Tank',
  })
  @IsBoolean()
  isTank: boolean;

  @ApiPropertyOptional({
    example: ['OPR_001', 'OPR_002'],
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
  vendorCode?: string;

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
