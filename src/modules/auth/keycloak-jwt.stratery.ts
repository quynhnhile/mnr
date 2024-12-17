import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RequestUser } from './domain/value-objects/request-user.value-object';
import { KeycloakService } from '@src/libs/keycloak/services/keycloak.service';

type DoneCallback = (err: any, user?: any, info?: any) => void;

export const KEYCLOAK_STRATEGY_NAME = 'keycloak-jwt';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(
  Strategy,
  KEYCLOAK_STRATEGY_NAME,
) {
  constructor(private readonly _keyCloakService: KeycloakService) {
    super();
  }

  async validate(req: Request, done: DoneCallback): Promise<void> {
    const token = this._extractTokenFromRequest(req);

    if (!token) {
      return done(new UnauthorizedException('No auth token'), false);
    }

    try {
      const payload = await this._keyCloakService.verifyToken(token);

      // get permissions and inject them into the payload
      // const permissionProps = (await this._keyCloakService.getPermissions(
      //   token,
      // )) as RequestUserPermissionsProps[];

      done(
        null,
        new RequestUser({
          ...payload,
          // permissions: permissionProps.map(
          //   (props) => new RequestUserPermissions(props),
          // ),
          permissions: [],
        }),
      );
    } catch (error) {
      done(
        new UnauthorizedException(
          'Invalid token or cannot retrieve permissions',
        ),
        false,
      );
    }
  }

  // TODO: rewrite to extract token from multiple sources: headers, body, query params, etc.
  private _extractTokenFromRequest(req: Request): string | null {
    if (req.headers?.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
    }
    return null;
  }
}
