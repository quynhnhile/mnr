import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PRISMA_MULTI_TENANT_OPTIONS } from './prisma-multi-tenant.module-definition';
import { PrismaMultiTenantOptions } from './interfaces';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private readonly _databaseUrl: string;
  private _clients = new Map<string, PrismaClient>();

  constructor(
    @Inject(PRISMA_MULTI_TENANT_OPTIONS)
    private _options: PrismaMultiTenantOptions,
  ) {
    this._databaseUrl = this._options.databaseUrl;
  }

  getClient(tenantId = 'public'): PrismaClient {
    let client = this._clients.get(tenantId);
    if (!client) {
      const databaseUrl = this._databaseUrl.replace(
        'public',
        'MNR_' + tenantId,
      );

      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });

      this._clients.set(tenantId, client);
    }
    return client;
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      Object.values(this._clients).map((client) => client.$disconnect()),
    );
  }
}
