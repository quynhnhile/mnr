import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { AgentResponseDto } from './agent.response.dto';

export class AgentPaginatedResponseDto extends PaginatedResponseDto<AgentResponseDto> {
  @ApiProperty({ type: AgentResponseDto, isArray: true })
  readonly data: readonly AgentResponseDto[];
}
