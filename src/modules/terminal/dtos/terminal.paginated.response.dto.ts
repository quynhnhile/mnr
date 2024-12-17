import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { TerminalResponseDto } from './terminal.response.dto';

export class TerminalPaginatedResponseDto extends PaginatedResponseDto<TerminalResponseDto> {
  @ApiProperty({ type: TerminalResponseDto, isArray: true })
  readonly data: readonly TerminalResponseDto[];
}
