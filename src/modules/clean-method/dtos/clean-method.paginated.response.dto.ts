import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { CleanMethodResponseDto } from './clean-method.response.dto';

export class CleanMethodPaginatedResponseDto extends PaginatedResponseDto<CleanMethodResponseDto> {
  @ApiProperty({ type: CleanMethodResponseDto, isArray: true })
  readonly data: readonly CleanMethodResponseDto[];
}
