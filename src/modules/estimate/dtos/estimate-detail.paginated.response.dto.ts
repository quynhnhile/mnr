import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { EstimateDetailResponseDto } from './estimate-detail.response.dto';

export class EstimateDetailPaginatedResponseDto extends PaginatedResponseDto<EstimateDetailResponseDto> {
  @ApiProperty({ type: EstimateDetailResponseDto, isArray: true })
  readonly data: readonly EstimateDetailResponseDto[];
}
