import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateCleanModeRequestDto {
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
    example: 'VSN',
    description: 'MÃ PHƯƠNG ÁN VỆ SINH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  cleanModeCode?: string;

  @ApiPropertyOptional({
    example: 'VỆ SINH NƯỚC',
    description: 'TÊN PHƯƠNG ÁN VỆ SINH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  cleanModeName?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
