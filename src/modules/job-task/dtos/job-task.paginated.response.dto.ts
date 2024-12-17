import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { JobTaskResponseDto } from './job-task.response.dto';

export class JobTaskPaginatedResponseDto extends PaginatedResponseDto<JobTaskResponseDto> {
  @ApiProperty({ type: JobTaskResponseDto, isArray: true })
  readonly data: readonly JobTaskResponseDto[];
}
