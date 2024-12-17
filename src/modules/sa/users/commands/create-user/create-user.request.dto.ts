import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';
import CredentialRepresentation from '@src/libs/keycloak/defs/credential-representation';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'app_user_test',
    description: 'TÊN',
  })
  @IsNotEmpty()
  @MaxLength(200)
  username: string;

  @ApiProperty({
    example: 'app_user_firstname',
    description: 'HỌ',
  })
  @IsNotEmpty()
  @MaxLength(200)
  firstName: string;

  @ApiProperty({
    example: 'app_user_lastName',
    description: 'TÊN',
  })
  @IsNotEmpty()
  @MaxLength(200)
  lastName: string;

  @ApiProperty({
    example: 'app_user@test.fr',
    description: 'EMAIL',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty({
    example: true,
    description: 'EMAIL ĐÃ XÁC THỰC',
  })
  @IsNotEmpty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty({
    example: {
      phone: ['4444444'],
      birthday: ['1993-12-26T01:23:45'],
    },
    description: 'THUỘC TÍNH',
  })
  @IsNotEmpty()
  @IsObject()
  attributes: { [index: string]: string[] };

  @ApiProperty({
    example: true,
    description: '',
  })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    example: [{ id: '', name: '' }],
    description: 'TÊN NHÓM',
  })
  @IsNotEmpty()
  @IsArray()
  groups: RoleMappingPayload[];

  @ApiProperty({
    example: [{ value: '' }],
    description: 'THÔNG TIN XÁC THỰC',
  })
  @IsNotEmpty()
  @IsArray()
  credentials: CredentialRepresentation[];
}
