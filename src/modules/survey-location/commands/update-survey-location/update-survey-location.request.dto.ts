import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSurveyLocationRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: 'GATE1',
    description: 'Tên vị trí khảo sát',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  surveyLocationCode?: string;

  @ApiPropertyOptional({
    example: 'Cổng 1',
    description: 'Tên vị trí khảo sát: Cổng | Tàu | Bãi | CFS',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  surveyLocationName?: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
