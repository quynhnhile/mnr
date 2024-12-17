import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { SysConfigOprResponseDto } from './sys-config-opr.response.dto';

export class SysConfigOprPaginatedResponseDto extends PaginatedResponseDto<SysConfigOprResponseDto> {
  @ApiProperty({ type: SysConfigOprResponseDto, isArray: true })
  readonly data: readonly SysConfigOprResponseDto[];
}
