import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ComDamRepResponseDto } from './com-dam-rep.response.dto';

export class ComDamRepPaginatedResponseDto extends PaginatedResponseDto<ComDamRepResponseDto> {
  @ApiProperty({ type: ComDamRepResponseDto, isArray: true })
  readonly data: readonly ComDamRepResponseDto[];
}
