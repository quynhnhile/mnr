import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { VendorTypeResponseDto } from './vendor-type.response.dto';

export class VendorTypePaginatedResponseDto extends PaginatedResponseDto<VendorTypeResponseDto> {
  @ApiProperty({ type: VendorTypeResponseDto, isArray: true })
  readonly data: readonly VendorTypeResponseDto[];
}
