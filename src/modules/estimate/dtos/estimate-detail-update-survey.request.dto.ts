import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EstimateDetailUpdateSurveyRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 1,
    description: 'Estimate detail id',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    example: 'MSC',
    description: 'Operation code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'C01',
    description: 'Component code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  compCode?: string;

  @ApiPropertyOptional({
    example: 'L01',
    description: 'Location code',
  })
  @IsOptional()
  @MaxLength(50)
  locCode?: string;

  @ApiPropertyOptional({
    example: 'D01',
    description: 'Damage code',
  })
  @IsOptional()
  @MaxLength(50)
  damCode?: string;

  @ApiPropertyOptional({
    example: 'R01',
    description: 'Repair code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  repCode?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Length',
  })
  @IsOptionalNonNullable()
  @IsNumber()
  @Min(0)
  length?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Width',
  })
  @IsOptionalNonNullable()
  @IsNumber()
  @Min(0)
  width?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantity',
  })
  @IsOptionalNonNullable()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 'P01',
    description: 'Payer code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  payerCode?: string;

  @ApiPropertyOptional({
    example: '*',
    description: 'Symbol code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(10)
  symbolCode?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Rate',
  })
  @IsOptionalNonNullable()
  @IsNumber()
  @Min(0)
  rate?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Is clean',
  })
  @IsOptional()
  @IsBoolean()
  isClean?: boolean;

  @ApiPropertyOptional({
    example: 'CM01',
    description: 'Clean method code',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  cleanMethodCode?: string | null;

  @ApiPropertyOptional({
    example: 'CM01',
    description: 'Clean mode code',
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  cleanModeCode?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Is operation cancel',
  })
  @IsOptional()
  @IsBoolean()
  isOprCancel?: boolean | null;

  @ApiPropertyOptional({
    example: 'Note',
    description: 'Note',
  })
  @IsOptional()
  note?: string;
}
