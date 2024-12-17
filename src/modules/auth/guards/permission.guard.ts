import { Observable } from 'rxjs';
import { systemConfig } from '@config/system.config';
import {
  AUTH_RESOURCE,
  AUTH_SCOPE,
} from '@libs/decorators/auth-permission.decorator';
import { extractHeader } from '@libs/utils/header.util';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  RequestUser,
  RequestUserPermissionsProps,
} from '../domain/value-objects/request-user.value-object';

const matchPermissions = (
  permissions: RequestUserPermissionsProps[],
  resource: string,
  scope: string,
): boolean => {
  return permissions.some(
    (permission) =>
      (permission.rsid === resource || permission.rsname === resource) &&
      permission.scopes.includes(scope),
  );
};

const matchTerminal = (terminals: string[], tenantId?: string) => {
  if (!tenantId) return false;
  return terminals.includes(tenantId);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Ignore permission check in development environment
    if (systemConfig.env === 'local' || systemConfig.env === 'development')
      return true;

    // Get resource and scope from handler
    const resource = this._reflector.get(AUTH_RESOURCE, context.getHandler());
    const scope = this._reflector.get(AUTH_SCOPE, context.getHandler());

    // If resource or scope is not defined, allow access
    if (!resource || !scope) return true;

    // Get user and check permissions
    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;
    const tenantId = extractHeader(request, 'x-tenant-id');

    return (
      user &&
      matchPermissions(user.permissions, resource, scope) &&
      matchTerminal(user.terminals, tenantId)
    );
  }
}
