import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConditionReeferRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG VỎ',
  })
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG MÁY',
  })
  @IsNotEmpty()
  @MaxLength(50)
  conditionMachineCode: string;

  @ApiProperty({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  @IsBoolean()
  isDamage: boolean;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  @IsNotEmpty()
  @MaxLength(50)
  mappingCode: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
