import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ScopeResponseDto } from './scope.response.dto';

export class ScopePaginatedResponseDto extends PaginatedResponseDto<ScopeResponseDto> {
  @ApiProperty({ type: ScopeResponseDto, isArray: true })
  readonly data: readonly ScopeResponseDto[];
}
