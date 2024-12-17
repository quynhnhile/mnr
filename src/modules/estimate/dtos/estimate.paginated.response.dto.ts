import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { EstimateResponseDto } from './estimate.response.dto';

export class EstimatePaginatedResponseDto extends PaginatedResponseDto<EstimateResponseDto> {
  @ApiProperty({ type: EstimateResponseDto, isArray: true })
  readonly data: readonly EstimateResponseDto[];
}
