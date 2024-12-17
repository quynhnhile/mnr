import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocalDmgDetailRequestDto {
  @ApiProperty({
    example: '',
    description: 'Mã hư hỏng nội bộ',
  })
  @IsNotEmpty()
  @MaxLength(50)
  damLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Vị trí hư hỏng nội bộ',
  })
  @IsNotEmpty()
  @MaxLength(50)
  locLocalCode: string;

  @ApiProperty({
    example: '*',
    description: 'Symbol code',
  })
  @IsNotEmpty()
  @MaxLength(50)
  symbolCode: string;

  @ApiProperty({
    example: '20',
    description: 'SIZE',
  })
  @IsNotEmpty()
  size: string;

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
