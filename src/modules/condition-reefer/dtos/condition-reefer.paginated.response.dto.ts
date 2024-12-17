import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ConditionReeferResponseDto } from './condition-reefer.response.dto';

export class ConditionReeferPaginatedResponseDto extends PaginatedResponseDto<ConditionReeferResponseDto> {
  @ApiProperty({ type: ConditionReeferResponseDto, isArray: true })
  readonly data: readonly ConditionReeferResponseDto[];
}
