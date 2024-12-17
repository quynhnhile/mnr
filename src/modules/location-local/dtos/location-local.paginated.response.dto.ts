import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { LocationLocalResponseDto } from './location-local.response.dto';

export class LocationLocalPaginatedResponseDto extends PaginatedResponseDto<LocationLocalResponseDto> {
  @ApiProperty({ type: LocationLocalResponseDto, isArray: true })
  readonly data: readonly LocationLocalResponseDto[];
}
