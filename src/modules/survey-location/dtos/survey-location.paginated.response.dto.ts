import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyLocationResponseDto } from './survey-location.response.dto';

export class SurveyLocationPaginatedResponseDto extends PaginatedResponseDto<SurveyLocationResponseDto> {
  @ApiProperty({ type: SurveyLocationResponseDto, isArray: true })
  readonly data: readonly SurveyLocationResponseDto[];
}
