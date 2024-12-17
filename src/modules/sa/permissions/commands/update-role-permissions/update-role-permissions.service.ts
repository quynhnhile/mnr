import { Injectable } from '@nestjs/common';
import {
  DecisionStrategy,
  Logic,
} from '@libs/keycloak/defs/policy-representation';
import { KeycloakAdminService } from '@src/libs/keycloak/services/keycloak-admin.service';
import {
  generatePermissionName,
  generatePolicyName,
} from '@modules/sa/permissions/services/permission.service';

@Injectable()
export class UpdateRolePermissionsService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async execute(data: {
    roleName: string;
    resourceId: string;
    scopeIds: string[];
  }): Promise<void> {
    const { roleName, resourceId, scopeIds = [] } = data;

    const [role, resource, scopes] = await Promise.all([
      this.keycloakAdminService.findRole(roleName),
      this.keycloakAdminService.findResource(resourceId),
      this.keycloakAdminService.findScopes(),
    ]);

    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }
    if (!resource) {
      throw new Error(`Resource ${resourceId} not found`);
    }
    // check if scopeIds are valid
    const invalidScopeIds = scopeIds.filter(
      (scopeId) => !scopes.find((scope) => scope.id === scopeId),
    );
    if (invalidScopeIds.length) {
      throw new Error(`Invalid scope IDs: ${invalidScopeIds.join(', ')}`);
    }

    // generate policy name & permission name
    const policyName = generatePolicyName(roleName, resource.name);
    const permissionName = generatePermissionName(roleName, resource.name);

    // find policy
    const foundPolicy = await this.keycloakAdminService.findPolicyByName(
      policyName,
    );

    // if policy exists, update policy and permission
    if (foundPolicy) {
      // get dependent permissions
      const dependentPermissions =
        await this.keycloakAdminService.findPolicyDependentPermissions(
          foundPolicy.id as string,
        );

      const updatePermission = dependentPermissions.find(
        (permission) => permission.name === permissionName,
      );
      if (updatePermission) {
        await this.keycloakAdminService.updatePermission(
          updatePermission.id as string,
          'scope',
          {
            name: permissionName,
            decisionStrategy: DecisionStrategy.AFFIRMATIVE,
            description: resource.displayName,
            policies: [foundPolicy.id as string],
            resources: [resource._id as string],
            scopes: scopeIds,
          },
        );
      } else {
        await this.keycloakAdminService.createPermission('scope', {
          name: permissionName,
          decisionStrategy: DecisionStrategy.AFFIRMATIVE,
          description: resource.displayName,
          policies: [foundPolicy.id as string],
          resources: [resource._id as string],
          scopes: scopeIds,
        });
      }
      return;
    }

    // create new policy and permission
    const policy = await this.keycloakAdminService.createPolicy('role', {
      name: policyName,
      type: 'role',
      logic: Logic.POSITIVE,
      roles: [
        {
          id: role.id as string,
          required: true,
        },
      ],
    });

    await this.keycloakAdminService.createPermission('scope', {
      name: permissionName,
      decisionStrategy: DecisionStrategy.AFFIRMATIVE,
      description: resource.displayName,
      policies: [policy.id as string],
      resources: [resource._id as string],
      scopes: scopeIds,
    });
  }
}
