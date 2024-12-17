import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: '',
    description: 'Refresh token',
  })
  @IsNotEmpty()
  refreshToken: string;
}
