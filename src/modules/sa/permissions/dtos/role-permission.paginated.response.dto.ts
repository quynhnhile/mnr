import { PaginatedResponseDto } from '@libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermissionResponseDto } from './role-permission.response.dto';

export class RolePermissionPaginatedResponseDto extends PaginatedResponseDto<RolePermissionResponseDto> {
  @ApiProperty({ type: RolePermissionResponseDto, isArray: true })
  readonly data: readonly RolePermissionResponseDto[];
}
