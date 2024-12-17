import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { RepairContResponseDto } from './repair-cont.response.dto';

export class RepairContPaginatedResponseDto extends PaginatedResponseDto<RepairContResponseDto> {
  @ApiProperty({ type: RepairContResponseDto, isArray: true })
  readonly data: readonly RepairContResponseDto[];
}
