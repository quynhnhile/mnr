import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequestDto {
  @ApiProperty({
    example: 'token',
    description: 'User token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'refreshToken',
    description: 'User refresh token',
  })
  @IsString()
  refreshToken: string;
}
