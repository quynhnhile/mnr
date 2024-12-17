import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassifyRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'B',
    description: 'MÃ PHÂN LOẠI CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  classifyCode?: string;

  @ApiPropertyOptional({
    example: 'TÊN PHÂN LOẠI CONTAINER',
    description: 'TÊN PHÂN LOẠI CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  classifyName?: string;

  @ApiPropertyOptional({
    example: 'mapping code test',
    description: 'MÃ MAPPING',
  })
  @IsOptionalNonNullable()
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
