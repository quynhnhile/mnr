import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { LocalDmgDetailResponseDto } from './local-dmg-detail.response.dto';

export class LocalDmgDetailPaginatedResponseDto extends PaginatedResponseDto<LocalDmgDetailResponseDto> {
  @ApiProperty({ type: LocalDmgDetailResponseDto, isArray: true })
  readonly data: readonly LocalDmgDetailResponseDto[];
}
