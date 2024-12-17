import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateConditionRequestDto {
  @ApiPropertyOptional({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'D',
    description: 'MÃ TÌNH TRẠNG CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'Damage',
    description: 'TÊN TÌNH TRẠNG CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  conditionName?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isDamage?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'PHÂN BIỆT VỎ MÁY ( CONT LẠNH )',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isMachine?: boolean;

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
