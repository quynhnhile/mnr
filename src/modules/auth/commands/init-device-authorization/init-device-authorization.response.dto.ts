import { KeycloakDeviceAuthInitResponse } from '@libs/keycloak/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class InitDeviceAuthorizationResponseDto {
  @ApiProperty({
    example: 'Xgp2qPoIdE1eu__rkCx12CI1pH1y4VfZONp9w7YTmW8',
    description: 'The device code',
  })
  deviceCode: string;

  @ApiProperty({
    example: 'AMPO-YSIT',
    description: 'The user code',
  })
  userCode: string;

  @ApiProperty({
    example: 'http://10.10.11.200:8090/realms/SNP/device',
    description: 'The verification URI',
  })
  verificationUri: string;

  @ApiProperty({
    example: 'http://10.10.11.200:8090/realms/SNP/device?user_code=AMPO-YSIT',
    description: 'The verification complete URI',
  })
  verificationUriComplete: string;

  @ApiProperty({
    example: 600,
    description:
      'The time in seconds that the device code and user code are valid',
  })
  expiresIn: number;

  @ApiProperty({
    example: 5,
    description:
      'The minimum amount of time in seconds that the client should wait between polling requests to the token endpoint',
  })
  interval: number;

  constructor(props: KeycloakDeviceAuthInitResponse) {
    this.deviceCode = props.device_code;
    this.userCode = props.user_code;
    this.verificationUri = props.verification_uri;
    this.verificationUriComplete = props.verification_uri_complete;
    this.expiresIn = props.expires_in;
    this.interval = props.interval;
  }
}
