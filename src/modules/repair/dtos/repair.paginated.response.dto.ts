import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { RepairResponseDto } from './repair.response.dto';

export class RepairPaginatedResponseDto extends PaginatedResponseDto<RepairResponseDto> {
  @ApiProperty({ type: RepairResponseDto, isArray: true })
  readonly data: readonly RepairResponseDto[];
}
