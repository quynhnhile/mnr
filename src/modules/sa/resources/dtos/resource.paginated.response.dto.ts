import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceResponseDto } from './resource.response.dto';

export class ResourcePaginatedResponseDto extends PaginatedResponseDto<ResourceResponseDto> {
  @ApiProperty({ type: ResourceResponseDto, isArray: true })
  readonly data: readonly ResourceResponseDto[];
}
