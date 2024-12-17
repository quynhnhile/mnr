import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConditionRequestDto {
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'C',
    description: 'MÃ TÌNH TRẠNG CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode: string;

  @ApiProperty({
    example: 'Cleaning',
    description: 'TÊN TÌNH TRẠNG CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(100)
  conditionName: string;

  @ApiProperty({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  @IsBoolean()
  isDamage: boolean;

  @ApiProperty({
    example: false,
    description: 'PHÂN BIỆT VỎ MÁY ( CONT LẠNH )',
  })
  @IsBoolean()
  isMachine: boolean;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  @IsOptional()
  @MaxLength(50)
  mappingCode: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
