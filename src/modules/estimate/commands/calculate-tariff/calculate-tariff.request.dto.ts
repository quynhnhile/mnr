import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateTariffRequestDto {
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
}
