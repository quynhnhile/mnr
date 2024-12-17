import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { RegionResponseDto } from './region.response.dto';

export class RegionPaginatedResponseDto extends PaginatedResponseDto<RegionResponseDto> {
  @ApiProperty({ type: RegionResponseDto, isArray: true })
  readonly data: readonly RegionResponseDto[];
}
