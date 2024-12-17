import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ContainerResponseDto } from './container.response.dto';

export class ContainerPaginatedResponseDto extends PaginatedResponseDto<ContainerResponseDto> {
  @ApiProperty({ type: ContainerResponseDto, isArray: true })
  readonly data: readonly ContainerResponseDto[];
}
