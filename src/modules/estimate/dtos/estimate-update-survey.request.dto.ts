import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstimateDetailUpdateSurveyRequestDto } from './estimate-detail-update-survey.request.dto';

export class EstimateUpdateSurveyRequestDto {
  @ApiProperty({
    example: 1,
    description: 'estimate ID',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: [EstimateDetailUpdateSurveyRequestDto],
    description: 'Danh sách chi tiết estimate',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EstimateDetailUpdateSurveyRequestDto)
  estimateDetails: EstimateDetailUpdateSurveyRequestDto[];
}
