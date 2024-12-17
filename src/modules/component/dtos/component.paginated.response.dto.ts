import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentResponseDto } from './component.response.dto';

export class ComponentPaginatedResponseDto extends PaginatedResponseDto<ComponentResponseDto> {
  @ApiProperty({ type: ComponentResponseDto, isArray: true })
  readonly data: readonly ComponentResponseDto[];
}
