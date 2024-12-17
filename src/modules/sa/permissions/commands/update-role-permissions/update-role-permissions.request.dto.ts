import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class RolePermissionsDto {
  @ApiProperty({
    example: '5e4d2bbc-5483-4747-b865-8bbee107b202',
    description: 'ID MENU',
  })
  @IsNotEmpty()
  @MaxLength(200)
  resourceId: string;

  @ApiPropertyOptional({
    example: ['5e4d2bbc-5483-4747-b865-8bbee107b202'],
    description: 'ID SCOPES',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNotEmpty({ each: true })
  scopeIds: string[];

  @ApiPropertyOptional({
    example: '',
    description: 'TÊN NHÓM',
  })
  @IsOptional()
  @MaxLength(200)
  roleName: string;
}

export class UpdateRolePermissionsRequestDto {
  @ApiProperty({
    example: [
      {
        resourceId: '',
        scopeIds: [''],
        roleName: '',
      },
    ],
    description: '',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique((e) => e.resourceId)
  @Type(() => RolePermissionsDto)
  @ValidateNested({ each: true })
  resources: RolePermissionsDto[];
}
