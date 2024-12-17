import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { DamageLocalResponseDto } from './damage-local.response.dto';

export class DamageLocalPaginatedResponseDto extends PaginatedResponseDto<DamageLocalResponseDto> {
  @ApiProperty({ type: DamageLocalResponseDto, isArray: true })
  readonly data: readonly DamageLocalResponseDto[];
}
