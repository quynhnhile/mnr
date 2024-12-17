import { Injectable } from '@nestjs/common';
import PolicyRepresentation from '@src/libs/keycloak/defs/policy-representation';
import ResourceRepresentation from '@src/libs/keycloak/defs/resource-representation';
import ScopeRepresentation from '@src/libs/keycloak/defs/scope-representation';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';

export function formatResouceName(name = ''): string {
  // replace / with _
  return name.replaceAll(/\//g, '_').toLocaleLowerCase();
}

export function generatePolicyName(
  roleName: string,
  resourceName = '',
  type = 'role',
): string {
  return `${type}_${roleName.toLocaleLowerCase()}_${formatResouceName(
    resourceName,
  )}`;
}

export function generatePermissionName(
  roleName: string,
  resourceName = '',
  type = 'scope',
): string {
  return `${type}_${roleName.toLocaleLowerCase()}_${formatResouceName(
    resourceName,
  )}`;
}

@Injectable()
export class GetListRoleWithPermissionsQueryHandler {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(roleName: string): Promise<
    Array<
      ResourceRepresentation & {
        scopes: Array<ScopeRepresentation & { enabled?: boolean }>;
      }
    >
  > {
    if (!roleName) return [];

    const [role, resources, allPermissions] = await Promise.all([
      this.keycloakAdminService.findRole(roleName),
      this.keycloakAdminService.findResources(),
      this.keycloakAdminService.findPermissions({ type: 'scope', max: -1 }),
    ]);

    if (!role) return [];

    return await Promise.all(
      resources
        .filter((item) => item.name !== 'Default Resource')
        .map(async (resource) => {
          const { name: resourceName } = resource;
          const permissions: PolicyRepresentation[] = [];
          const scopes: Array<ScopeRepresentation & { enabled?: boolean }> = (
            resource.scopes || []
          ).map((scope) => ({ ...scope, enabled: false }));

          const permissionKey = generatePermissionName(roleName, resourceName);

          // put permissions that match the role and resource in the resource map
          allPermissions.forEach((permission) => {
            if (permission.name !== permissionKey) {
              return;
            }

            permissions.push(permission);
          });

          if (permissions.length) {
            // get associated scopes
            for (const permission of permissions) {
              const associatedScopes =
                await this.keycloakAdminService.findPermissionAssociatedScopes(
                  permission.id as string,
                );

              if (associatedScopes.length) {
                associatedScopes.forEach((scope) => {
                  const scopeIndex = scopes.findIndex((s) => s.id === scope.id);

                  if (scopeIndex >= 0) {
                    scopes[scopeIndex] = {
                      ...scopes[scopeIndex],
                      enabled: true,
                    };
                  }
                });
              }
            }
          }

          return { ...resource, scopes };
        }),
    );
  }
}
