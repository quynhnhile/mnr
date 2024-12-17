import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ConditionResponseDto } from './condition.response.dto';

export class ConditionPaginatedResponseDto extends PaginatedResponseDto<ConditionResponseDto> {
  @ApiProperty({ type: ConditionResponseDto, isArray: true })
  readonly data: readonly ConditionResponseDto[];
}
