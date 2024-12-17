import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { TariffGroupResponseDto } from './tariff-group.response.dto';

export class TariffGroupPaginatedResponseDto extends PaginatedResponseDto<TariffGroupResponseDto> {
  @ApiProperty({ type: TariffGroupResponseDto, isArray: true })
  readonly data: readonly TariffGroupResponseDto[];
}
