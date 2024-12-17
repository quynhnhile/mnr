import { Observable } from 'rxjs';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KEYCLOAK_STRATEGY_NAME } from '../keycloak-jwt.stratery';

@Injectable()
export class KeycloakAuthGuard extends AuthGuard(KEYCLOAK_STRATEGY_NAME) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
