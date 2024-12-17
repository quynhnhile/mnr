import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateDamageLocalRequestDto {
  @ApiPropertyOptional({
    example: 'GD',
    description: 'MÃ HƯ HỎNG NỘI BỘ CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  damLocalCode?: string;

  @ApiPropertyOptional({
    example: 'GOUGED',
    description: 'TÊN TIẾNG ANH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  damLocalNameEn?: string;

  @ApiPropertyOptional({
    example: 'XƯỚC',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  damLocalNameVi?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
