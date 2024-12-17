import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { SymbolResponseDto } from './symbol.response.dto';

export class SymbolPaginatedResponseDto extends PaginatedResponseDto<SymbolResponseDto> {
  @ApiProperty({ type: SymbolResponseDto, isArray: true })
  readonly data: readonly SymbolResponseDto[];
}
