import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateProfileUserRequestDto {
  @ApiPropertyOptional({
    example: 'app_user_firstname',
    description: 'HỌ',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  firstName: string;

  @ApiPropertyOptional({
    example: 'app_user_lastName',
    description: 'TÊN',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(200)
  lastName: string;

  @ApiPropertyOptional({
    example: true,
    description: 'EMAIL ĐÃ XÁC THỰC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiPropertyOptional({
    example: {
      phone: ['4444444'],
      birthday: ['1993-12-26T01:23:45'],
    },
    description: 'THUỘC TÍNH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsObject()
  attributes: { [index: string]: string[] };

  @ApiPropertyOptional({
    example: true,
    description: '',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({
    example: [{ id: '', name: '' }],
    description: 'TÊN NHÓM',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsArray()
  groups: RoleMappingPayload[];
}
