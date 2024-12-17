import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { LocationResponseDto } from './location.response.dto';

export class LocationPaginatedResponseDto extends PaginatedResponseDto<LocationResponseDto> {
  @ApiProperty({ type: LocationResponseDto, isArray: true })
  readonly data: readonly LocationResponseDto[];
}
