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
