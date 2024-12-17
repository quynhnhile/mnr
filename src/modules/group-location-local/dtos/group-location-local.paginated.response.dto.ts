import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { GroupLocationLocalResponseDto } from './group-location-local.response.dto';

export class GroupLocationLocalPaginatedResponseDto extends PaginatedResponseDto<GroupLocationLocalResponseDto> {
  @ApiProperty({ type: GroupLocationLocalResponseDto, isArray: true })
  readonly data: readonly GroupLocationLocalResponseDto[];
}
