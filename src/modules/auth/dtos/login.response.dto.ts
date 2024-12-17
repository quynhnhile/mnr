import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from './permission.response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'some-id',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@mailinator.com',
    description: "User's email address",
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: "User's name",
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: "User's last name",
  })
  lastName: string;

  // @ApiProperty({
  //   example: 'Doe',
  //   description: "User's name",
  // })
  // userName: string;

  // @ApiProperty({
  //   example: 'TER02',
  //   description: 'Mã cảng',
  // })
  // terminals: string[];

  @ApiProperty({
    description: 'User permissions',
  })
  permissions: PermissionResponseDto[];

  @ApiProperty({
    description: 'User permissions',
  })
  regions: any[];
}
