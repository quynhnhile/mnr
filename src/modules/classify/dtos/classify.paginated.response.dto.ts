import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ClassifyResponseDto } from './classify.response.dto';

export class ClassifyPaginatedResponseDto extends PaginatedResponseDto<ClassifyResponseDto> {
  @ApiProperty({ type: ClassifyResponseDto, isArray: true })
  readonly data: readonly ClassifyResponseDto[];
}
