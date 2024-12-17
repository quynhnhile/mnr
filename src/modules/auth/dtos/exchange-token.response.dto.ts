import { KeycloakExchangeTokenResponse } from '@libs/keycloak/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeTokenResponseDto {
  @ApiProperty({
    example: 'access_token',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: '85400',
    description: 'Token expiration time in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: 'refresh_token',
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: '604800',
    description: 'Refresh token expiration time in seconds',
  })
  refreshExpiresIn: number;

  @ApiProperty({
    example: 'id_token',
    description: 'ID token',
  })
  idToken: string;

  @ApiProperty({
    example: 'Bearer',
    description: 'Token type',
  })
  tokenType: string;

  @ApiProperty({
    example: '1723000174',
    description: 'Not before policy',
  })
  notBeforePolicy: number;

  @ApiProperty({
    example: '70248642-54df-4df9-ad23-45d1ce1dc68b',
    description: 'Session state',
  })
  sessionState: string;

  @ApiProperty({
    example: 'openid profile email',
    description: 'Scope',
  })
  scope: string;

  constructor(props: KeycloakExchangeTokenResponse) {
    this.accessToken = props.access_token;
    this.expiresIn = props.expires_in;
    this.refreshToken = props.refresh_token;
    this.refreshExpiresIn = props.refresh_expires_in;
    this.idToken = props.id_token;
    this.tokenType = props.token_type;
    this.notBeforePolicy = props['not-before-policy'];
    this.sessionState = props.session_state;
    this.scope = props.scope;
  }
}
