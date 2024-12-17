import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { StatusTypeResponseDto } from './status-type.response.dto';

export class StatusTypePaginatedResponseDto extends PaginatedResponseDto<StatusTypeResponseDto> {
  @ApiProperty({ type: StatusTypeResponseDto, isArray: true })
  readonly data: readonly StatusTypeResponseDto[];
}
