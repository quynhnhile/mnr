import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { VendorResponseDto } from './vendor.response.dto';

export class VendorPaginatedResponseDto extends PaginatedResponseDto<VendorResponseDto> {
  @ApiProperty({ type: VendorResponseDto, isArray: true })
  readonly data: readonly VendorResponseDto[];
}
