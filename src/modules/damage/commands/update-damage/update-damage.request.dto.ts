import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateDamageRequestDto {
  @ApiPropertyOptional({
    example: 'GLC',
    description: 'MÃ HÃNG TÀU',
  })
  @MaxLength(50)
  @IsOptional()
  operationCode?: string;

  @ApiPropertyOptional({
    example: 'GD',
    description: 'MÃ HƯ HỎNG CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  damCode?: string;

  @ApiPropertyOptional({
    example: 'GOUGED',
    description: 'TÊN TIẾNG ANH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  damNameEn?: string;

  @ApiPropertyOptional({
    example: 'XƯỚC',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  damNameVi?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
