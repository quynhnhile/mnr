import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateSymbolRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'MÃ PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  symbolCode: string;

  @ApiPropertyOptional({
    example: '',
    description: 'TÊN PHÂN ĐỊNH TRÁCH NHIỆM',
  })
  @IsOptionalNonNullable()
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
