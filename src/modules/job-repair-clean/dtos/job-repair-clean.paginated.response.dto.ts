import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { JobRepairCleanResponseDto } from './job-repair-clean.response.dto';

export class JobRepairCleanPaginatedResponseDto extends PaginatedResponseDto<JobRepairCleanResponseDto> {
  @ApiProperty({ type: JobRepairCleanResponseDto, isArray: true })
  readonly data: readonly JobRepairCleanResponseDto[];
}
