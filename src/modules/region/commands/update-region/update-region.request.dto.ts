import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateRegionRequestDto {
  @ApiPropertyOptional({
    example: 'S',
    description: 'MÃ VÙNG MIỀN',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  regionCode: string;

  @ApiPropertyOptional({
    example: 'Miền Nam',
    description: 'TÊN VÙNG MIỀN',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  regionName: string;

  @ApiPropertyOptional({
    example: 'Miền Nam',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
