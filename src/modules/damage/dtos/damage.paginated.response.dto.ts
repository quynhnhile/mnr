import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { DamageResponseDto } from './damage.response.dto';

export class DamagePaginatedResponseDto extends PaginatedResponseDto<DamageResponseDto> {
  @ApiProperty({ type: DamageResponseDto, isArray: true })
  readonly data: readonly DamageResponseDto[];
}
