import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateComDamRepRequestDto {
  @ApiPropertyOptional({
    example: 'PSC',
    description: 'MÃ BỘ PHẬN CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  compCode?: string;

  @ApiPropertyOptional({
    example: 'CT',
    description: 'MÃ HƯ HỎNG',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  damCode?: string;

  @ApiPropertyOptional({
    example: 'LT',
    description: 'MÃ SỬA CHỮA',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  repCode?: string;

  @ApiPropertyOptional({
    example: 'PANEL - LEFT SIDE ROOF OR TOP LT - CONTAMINATED',
    description: 'TÊN TIẾNG ANH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  nameEn?: string;

  @ApiPropertyOptional({
    example: 'VÁCH - TRÁI NÓC LT - DƠ BẨN TẠO VẾT',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  nameVi?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ COM_DAM_REP',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
