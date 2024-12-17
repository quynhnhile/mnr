import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponseDto } from './survey.response.dto';

export class SurveyPaginatedResponseDto extends PaginatedResponseDto<SurveyResponseDto> {
  @ApiProperty({ type: SurveyResponseDto, isArray: true })
  readonly data: readonly SurveyResponseDto[];
}
