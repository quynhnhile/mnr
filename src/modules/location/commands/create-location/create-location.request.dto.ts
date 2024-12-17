import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationRequestDto {
  @ApiProperty({
    example: 'CODE LOCATION 2',
    description: 'MÃ VỊ TRÍ CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  locCode: string;

  @ApiProperty({
    example: 'NAME LOCATION 2',
    description: 'TÊN TIẾNG ANH',
  })
  @IsNotEmpty()
  @MaxLength(200)
  locNameEn: string;

  @ApiPropertyOptional({
    example: 'TÊN VỊ TRÍ CONTAINER 2',
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
