import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCleanModeRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({
    example: 'VSHC',
    description: 'MÃ PHƯƠNG ÁN VỆ SINH',
  })
  @IsNotEmpty()
  @MaxLength(50)
  cleanModeCode: string;

  @ApiProperty({
    example: 'VỆ SINH HÓA CHẤT',
    description: 'TÊN PHƯƠNG ÁN VỆ SINH',
  })
  @IsNotEmpty()
  @MaxLength(100)
  cleanModeName: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ PHƯƠNG ÁN VS',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
