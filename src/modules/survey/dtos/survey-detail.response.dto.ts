import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SurveyDetailResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: '1',
    description: 'Survey ID',
  })
  idSurvey: string;

  @ApiProperty({
    example: 'CONT001',
    description: 'Container ID',
  })
  idCont: string;

  @ApiProperty({
    example: 'CONT001',
    description: 'Container No',
  })
  containerNo: string;

  @ApiProperty({
    example: 'SUR001',
    description: 'Survey No',
  })
  surveyNo: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Survey Date',
  })
  surveyDate: Date;

  @ApiProperty({
    example: 'john.doe',
    description: 'Survey By',
  })
  surveyBy: string;

  @ApiPropertyOptional({
    example: 'Note survey',
    description: 'Survey Note',
  })
  noteSurvey?: string | null;

  @ApiPropertyOptional({
    example: 'Note',
    description: 'Note',
  })
  note?: string | null;
}
