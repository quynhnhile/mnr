import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSurveyDetailRequestDto {
  @ApiPropertyOptional({
    example: 'GHI CHÚ KHẢO SÁT',
    description: 'GHI CHÚ KHẢO SÁT',
  })
  @IsOptional()
  noteSurvey?: string | null;

  @ApiPropertyOptional({
    example: 'GHI CHÚ',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string | null;
}
