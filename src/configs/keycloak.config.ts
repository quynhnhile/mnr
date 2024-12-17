import '@libs/utils/dotenv';

import { get } from 'env-var';

export const keycloakConfig = {
  url: get('KEYCLOAK_URL').required().asString(),
  realm: get('KEYCLOAK_REALM').required().asString(),
  clientId: get('KEYCLOAK_CLIENT_ID').required().asString(),
  client: get('KEYCLOAK_CLIENT').required().asString(),
  clientSecret: get('KEYCLOAK_CLIENT_SECRET').required().asString(),
  jwtSecretCert: get('KEYCLOAK_JWT_CERTIFICATE').asString(),
  username: get('KEYCLOAK_ADMIN_USERNAME').required().asString(),
  password: get('KEYCLOAK_ADMIN_PASSWORD').required().asString(),
};
