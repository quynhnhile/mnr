import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { InfoContResponseDto } from './info-cont.response.dto';

export class InfoContPaginatedResponseDto extends PaginatedResponseDto<InfoContResponseDto> {
  @ApiProperty({ type: InfoContResponseDto, isArray: true })
  readonly data: readonly InfoContResponseDto[];
}
