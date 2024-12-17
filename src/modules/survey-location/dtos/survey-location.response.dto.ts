import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SurveyLocationResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'GATE1',
    description: 'Tên vị trí khảo sát',
  })
  surveyLocationCode: string;

  @ApiProperty({
    example: 'Cổng 1',
    description: 'Tên vị trí khảo sát: Cổng | Tàu | Bãi | CFS',
  })
  surveyLocationName: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  note?: string | null;
}
