import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { PayerResponseDto } from './payer.response.dto';

export class PayerPaginatedResponseDto extends PaginatedResponseDto<PayerResponseDto> {
  @ApiProperty({ type: PayerResponseDto, isArray: true })
  readonly data: readonly PayerResponseDto[];
}
