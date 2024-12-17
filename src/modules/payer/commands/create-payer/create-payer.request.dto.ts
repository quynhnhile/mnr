import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayerRequestDto {
  @ApiProperty({
    example: 'O',
    description: 'MÃ TRÁCH NHIỆM',
  })
  @IsNotEmpty()
  @MaxLength(50)
  payerCode: string;

  @ApiProperty({
    example: 'TRÁCH NHIỆM HÃNG TÀU',
    description: 'ĐƠN VỊ CHỊU TRÁCH NHIỆM',
  })
  @IsNotEmpty()
  @MaxLength(200)
  payerName: string;

  @ApiProperty({
    example: '',
    description: 'MAPPING MÃ PHÂN LOẠI TRÁCH NHIỆM CỦA TOPOVN/TTOS',
  })
  @IsNotEmpty()
  @MaxLength(50)
  mappingTos: string;

  @ApiPropertyOptional({
    example: 'Hư hỏng do hãng tàu',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
