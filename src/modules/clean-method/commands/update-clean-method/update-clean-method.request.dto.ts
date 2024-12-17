import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateCleanMethodRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'VSL',
    description: 'MÃ PHƯƠNG THỨC VỆ SINH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  cleanMethodCode?: string;

  @ApiPropertyOptional({
    example: 'VỆ SINH LUMPSUM',
    description: 'TÊN PHƯƠNG THỨC VỆ SINH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  cleanMethodName?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
