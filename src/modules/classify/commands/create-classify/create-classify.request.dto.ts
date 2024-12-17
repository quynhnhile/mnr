import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClassifyRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'A',
    description: 'MÃ PHÂN LOẠI CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  classifyCode: string;

  @ApiProperty({
    example: 'TÊN PHÂN LOẠI CONTAINER',
    description: 'TÊN PHÂN LOẠI CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(100)
  classifyName: string;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  @IsOptional()
  @MaxLength(50)
  mappingCode?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
