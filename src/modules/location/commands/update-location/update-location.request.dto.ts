import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateLocationRequestDto {
  @ApiPropertyOptional({
    example: 'CODE LOCATION 3',
    description: 'MÃ VỊ TRÍ CONTAINER',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  locCode?: string;

  @ApiPropertyOptional({
    example: 'NAME LOCATION 3',
    description: 'TÊN TIẾNG ANH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  locNameEn?: string;

  @ApiPropertyOptional({
    example: 'TÊN VỊ TRÍ CONTAINER 3',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  locNameVi?: string;

  @ApiPropertyOptional({
    example: 'LEFT',
    description: 'MẶT LẮP RÁP',
  })
  @IsOptional()
  @MaxLength(10)
  side?: string;

  @ApiPropertyOptional({
    example: '20',
    description: 'SIZE',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number;

  @ApiPropertyOptional({
    example: 'GHI CHÚ VỊ TRÍ CONTAINER',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
