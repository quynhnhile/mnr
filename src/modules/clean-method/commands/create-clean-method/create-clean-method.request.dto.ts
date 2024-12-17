import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCleanMethodRequestDto {
  // Add more properties here
  // Add more properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'VSHT',
    description: 'MÃ PHƯƠNG THỨC VỆ SINH',
  })
  @IsNotEmpty()
  @MaxLength(50)
  cleanMethodCode: string;

  @ApiProperty({
    example: 'VỆ SINH HÃNG TÀU',
    description: 'TÊN PHƯƠNG THỨC VỆ SINH',
  })
  @IsNotEmpty()
  @MaxLength(100)
  cleanMethodName: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
