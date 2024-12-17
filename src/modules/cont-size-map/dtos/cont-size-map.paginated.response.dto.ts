import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ContSizeMapResponseDto } from './cont-size-map.response.dto';

export class ContSizeMapPaginatedResponseDto extends PaginatedResponseDto<ContSizeMapResponseDto> {
  @ApiProperty({ type: ContSizeMapResponseDto, isArray: true })
  readonly data: readonly ContSizeMapResponseDto[];
}
