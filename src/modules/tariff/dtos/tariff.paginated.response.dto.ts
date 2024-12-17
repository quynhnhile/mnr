import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { TariffResponseDto } from './tariff.response.dto';

export class TariffPaginatedResponseDto extends PaginatedResponseDto<TariffResponseDto> {
  @ApiProperty({ type: TariffResponseDto, isArray: true })
  readonly data: readonly TariffResponseDto[];
}
