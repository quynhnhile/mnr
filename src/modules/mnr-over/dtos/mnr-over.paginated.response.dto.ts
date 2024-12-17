import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { MnrOverResponseDto } from './mnr-over.response.dto';

export class MnrOverPaginatedResponseDto extends PaginatedResponseDto<MnrOverResponseDto> {
  @ApiProperty({ type: MnrOverResponseDto, isArray: true })
  readonly data: readonly MnrOverResponseDto[];
}
