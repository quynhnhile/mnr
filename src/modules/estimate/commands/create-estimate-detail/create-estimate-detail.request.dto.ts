import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEstimateDetailRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'MSC',
    description: 'operation code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'C01',
    description: 'Component code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  compCode: string;

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

  @ApiProperty({
    example: 'R01',
    description: 'Repair code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  repCode: string;

  @ApiProperty({
    example: 10,
    description: 'Length',
  })
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({
    example: 10,
    description: 'Width',
  })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity',
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 'P01',
    description: 'Payer code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  payerCode: string;

  @ApiProperty({
    example: '*',
    description: 'Symbol code',
  })
  @IsNotEmpty()
  @MaxLength(10)
  symbolCode: string;

  @ApiProperty({
    example: 10,
    description: 'Rate',
  })
  @IsNumber()
  @Min(0)
  rate: number;

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
    example: 'Note',
    description: 'Note',
  })
  @IsOptional()
  note?: string;
}
