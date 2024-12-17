import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSymbolRequestDto {
  @ApiProperty({
    example: '',
    description: 'MÃ PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  @IsNotEmpty()
  @MaxLength(50)
  symbolCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  @IsNotEmpty()
  @MaxLength(200)
  symbolName: string;

  @ApiPropertyOptional({
    example: 'ghi chú',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(200)
  note?: string;
}
