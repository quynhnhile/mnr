import '@libs/utils/dotenv';

import { get } from 'env-var';

export const jwtConfig = {
  secret: get('JWT_SECRET').default('').asString(),
  jwksUrl: get('JWKS_URL').default('').asString(),
  clientId: get('JWT_CLIENT_ID').required().asString(),
};
