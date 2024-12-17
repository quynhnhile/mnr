import { ApiPropertyOptional } from '@nestjs/swagger';
import { RolePermissionsDto } from '../commands/update-role-permissions/update-role-permissions.request.dto';
import { ArrayUnique, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RolePermissionResponseDto {
  @ApiPropertyOptional({
    example: [
      {
        resourceId: '',
        scopeIds: [''],
        roleName: '',
      },
    ],
    description: '',
  })
  @ArrayUnique((e) => e.resourceId)
  @Type(() => RolePermissionsDto)
  @ValidateNested({ each: true })
  resources: RolePermissionsDto[];
}
