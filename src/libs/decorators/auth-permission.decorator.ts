import { SetMetadata, applyDecorators } from '@nestjs/common';

export const AUTH_RESOURCE = 'AUTH_RESOURCE';
export const AUTH_SCOPE = 'AUTH_SCOPE';

export function AuthResource(resourceName: string): MethodDecorator {
  return applyDecorators(SetMetadata(AUTH_RESOURCE, resourceName));
}

export function AuthPolicy(scopeName: string): MethodDecorator {
  return applyDecorators(SetMetadata(AUTH_SCOPE, scopeName));
}

export function AuthPermission(
  resourceName: string,
  scopeName: string,
): MethodDecorator {
  return applyDecorators(AuthResource(resourceName), AuthPolicy(scopeName));
}
