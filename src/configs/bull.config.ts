import '@libs/utils/dotenv';

import { get } from 'env-var';
import { BullRootModuleOptions } from '@nestjs/bullmq';

const tlsConfig = get('REDIS_SERVER_CA_PATH').asString()
  ? { tls: { path: get('REDIS_SERVER_CA_PATH').asString() } }
  : null;

export const bullConfig: BullRootModuleOptions = {
  connection: {
    host: get('REDIS_HOST').default('localhost').asString(),
    port: get('REDIS_PORT').default(6379).asPortNumber(),
    password: get('REDIS_PASSWORD').default('').asString(),
    family: get('REDIS_FAMILY').default(4).asIntPositive(),
    ...tlsConfig,
  },
};
