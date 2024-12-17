import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateConditionReeferRequestDto {
  @ApiPropertyOptional({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG VỎ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  conditionCode?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ PHÂN LOẠI TÌNH TRẠNG MÁY',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  conditionMachineCode?: string;

  @ApiProperty({
    example: false,
    description: 'HƯ HỎNG CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsBoolean()
  isDamage?: boolean;

  @ApiPropertyOptional({
    example: 'test',
    description: 'MÃ MAPPING',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  mappingCode?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
