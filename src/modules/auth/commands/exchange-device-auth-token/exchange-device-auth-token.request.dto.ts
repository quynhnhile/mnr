import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeDeviceAuthTokenRequestDto {
  @ApiProperty({
    example: 'Xgp2qPoIdE1eu__rkCx12CI1pH1y4VfZONp9w7YTmW8',
    description: 'The device code',
  })
  @IsNotEmpty()
  deviceCode: string;
}
