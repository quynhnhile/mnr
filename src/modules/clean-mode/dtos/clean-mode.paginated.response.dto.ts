import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { CleanModeResponseDto } from './clean-mode.response.dto';

export class CleanModePaginatedResponseDto extends PaginatedResponseDto<CleanModeResponseDto> {
  @ApiProperty({ type: CleanModeResponseDto, isArray: true })
  readonly data: readonly CleanModeResponseDto[];
}
