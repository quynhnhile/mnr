import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyDetailResponseDto } from './survey-detail.response.dto';

export class SurveyDetailPaginatedResponseDto extends PaginatedResponseDto<SurveyDetailResponseDto> {
  @ApiProperty({ type: SurveyDetailResponseDto, isArray: true })
  readonly data: readonly SurveyDetailResponseDto[];
}
