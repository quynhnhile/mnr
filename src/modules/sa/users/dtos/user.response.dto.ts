import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';

export class UserResponseDto {
  @ApiPropertyOptional({
    example: '',
    description: 'ID NGƯỜI DÙNG',
  })
  id?: string;

  @ApiPropertyOptional({
    example: 'app_user_test',
    description: 'TÊN',
  })
  username?: string;

  @ApiPropertyOptional({
    example: 'app_user_firstname',
    description: 'HỌ',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'app_user_lastName',
    description: 'TÊN',
  })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'app_user@test.fr',
    description: 'EMAIL',
  })
  email?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'EMAIL ĐÃ XÁC THỰC',
  })
  emailVerified?: boolean;

  @ApiPropertyOptional({
    example: {
      phone: ['4444444'],
      birthday: ['1993-12-26T01:23:45'],
    },
    description: 'THUỘC TÍNH',
  })
  attributes?: { [index: string]: string[] };

  @ApiPropertyOptional({
    example: true,
    description: '',
  })
  enabled?: boolean;

  @ApiPropertyOptional({
    example: [{ id: '', name: '' }],
    description: 'THUỘC NHÓM',
  })
  groups?: RoleMappingPayload[];

  @ApiPropertyOptional({
    example: 456,
    description: 'NGÀY TẠO',
  })
  createdTimestamp?: number;
}
