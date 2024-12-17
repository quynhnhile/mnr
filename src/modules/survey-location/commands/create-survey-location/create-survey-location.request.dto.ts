import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSurveyLocationRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'GATE1',
    description: 'Tên vị trí khảo sát',
  })
  @IsNotEmpty()
  @MaxLength(50)
  surveyLocationCode: string;

  @ApiProperty({
    example: 'Cổng 1',
    description: 'Tên vị trí khảo sát: Cổng | Tàu | Bãi | CFS',
  })
  @IsNotEmpty()
  @MaxLength(200)
  surveyLocationName: string;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
