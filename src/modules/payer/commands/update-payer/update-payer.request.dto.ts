import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdatePayerRequestDto {
  @ApiPropertyOptional({
    example: 'O',
    description: 'MÃ TRÁCH NHIỆM',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  payerCode: string;

  @ApiPropertyOptional({
    example: 'TRÁCH NHIỆM HÃNG TÀU',
    description: 'ĐƠN VỊ CHỊU TRÁCH NHIỆM',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  payerName: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MAPPING MÃ PHÂN LOẠI TRÁCH NHIỆM CỦA TOPOVN/TTOS',
  })
  @IsOptionalNonNullable()
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
