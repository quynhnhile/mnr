import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class LocalDmgDetailUpdateSurveyRequestDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Estimate detail id',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    example: '',
    description: 'Mã hư hỏng nội bộ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  damLocalCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Vị trí hư hỏng nội bộ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  locLocalCode?: string;

  @ApiPropertyOptional({
    example: '*',
    description: 'Symbol code',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  symbolCode?: string;

  @ApiPropertyOptional({
    example: '20',
    description: 'SIZE',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  size?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'Diễn giải hư hỏng',
  })
  @IsOptional()
  damDesc?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'Note',
  })
  @IsOptional()
  note?: string;
}
