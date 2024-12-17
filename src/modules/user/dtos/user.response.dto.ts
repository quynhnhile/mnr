import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../domain/user.entity';

export class UserResponseDto extends ResponseBase<UserEntity['id']> {
  @ApiProperty({
    example: 'joh-doe@gmail.com',
    description: "User's email address",
  })
  email: string;

  @ApiProperty({
    example: 'France',
    description: "User's country of residence",
  })
  country: string;

  @ApiProperty({
    example: '123456',
    description: 'Postal code',
  })
  postalCode: string;

  @ApiProperty({
    example: 'Park Avenue',
    description: 'Street where the user is registered',
  })
  street: string;
}
