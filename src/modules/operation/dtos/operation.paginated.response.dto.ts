import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { OperationResponseDto } from './operation.response.dto';

export class OperationPaginatedResponseDto extends PaginatedResponseDto<OperationResponseDto> {
  @ApiProperty({ type: OperationResponseDto, isArray: true })
  readonly data: readonly OperationResponseDto[];
}
