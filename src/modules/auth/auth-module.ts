import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ExchangeDeviceAuthTokenHttpController } from './commands/exchange-device-auth-token/exchange-device-auth-token.http.controller';
import { ExchangeDeviceAuthorizationTokenService } from './commands/exchange-device-auth-token/exchange-device-auth-token.service';
import { ExchangeTokenHttpController } from './commands/exchange-token/exchange-token.http.controller';
import { ExchangeTokenService } from './commands/exchange-token/exchange-token.service';
import { InitDeviceAuthorizationHttpController } from './commands/init-device-authorization/init-device-authorization.http.controller';
import { InitDeviceAuthorizationService } from './commands/init-device-authorization/init-device-authorization.service';
import { LoginHttpController } from './commands/login/login.http.controller';
import { LoginService } from './commands/login/login.service';
import { LogoutHttpController } from './commands/logout/logout.http.controller';
import { LogoutService } from './commands/logout/logout.service';
import { RefreshTokenHttpController } from './commands/refresh-token/refresh-token.http.controller';
import { RefreshTokenService } from './commands/refresh-token/refresh-token.service';
import { KeycloakStrategy } from './keycloak-jwt.stratery';
import { GetPermissionsHttpController } from './queries/get-permissions/get-permissions.http.controller';
import { GetPermissionsQueryHandler } from './queries/get-permissions/get-permissions.query-handler';

const httpControllers = [
  ExchangeTokenHttpController,
  LoginHttpController,
  LogoutHttpController,
  GetPermissionsHttpController,
  InitDeviceAuthorizationHttpController,
  ExchangeDeviceAuthTokenHttpController,
  RefreshTokenHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  ExchangeTokenService,
  LoginService,
  LogoutService,
  InitDeviceAuthorizationService,
  ExchangeDeviceAuthorizationTokenService,
  RefreshTokenService,
];

const queryHandlers: Provider[] = [GetPermissionsQueryHandler];

const mappers: Provider[] = [];

const repositories: Provider[] = [];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    KeycloakStrategy,
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class AuthModule {}
