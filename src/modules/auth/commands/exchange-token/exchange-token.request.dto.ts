import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeTokenRequestDto {
  @ApiProperty({
    example:
      'f0e7d854-f75f-4ee3-b7b5-ec8c6bba59e0.70248642-54df-4df9-ad23-45d1ce1dc68b.ab87a853-0206-485b-9c0a-45cbc9fa10b3',
    description: 'Authorization code',
  })
  @IsString()
  readonly code: string;

  @ApiProperty({
    example: 'http://localhost:3000/callback',
    description: 'Redirect URI',
  })
  @IsString()
  @Matches(/^(http|https):\/\/[^ "]+$/)
  readonly redirectUri: string;
}
