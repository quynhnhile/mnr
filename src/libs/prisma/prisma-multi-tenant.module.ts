import { Module } from '@nestjs/common';
import { PrismaClientManager } from './prisma-client-manager';
import { PrismaMultiTenantModuleClass } from './prisma-multi-tenant.module-definition';

export interface ContextPayload {
  tenantId: string;
}

// @Module({})
// export class PrismaMultiTenantModule extends PrismaMultiTenantModuleClass {
//   static forRootAsync(
//     options: typeof PRISMA_ASYNC_OPTIONS_TYPE,
//   ): DynamicModule {
//     const moduleDefition = super.forRootAsync(options);

//     const providers = moduleDefition.providers || [];
//     providers.push(PrismaClientManager, {
//       provide: PrismaService,
//       scope: Scope.REQUEST,
//       durable: true,
//       inject: [REQUEST, PrismaClientManager],
//       useFactory: (ctxPayload: ContextPayload, manager: PrismaClientManager) =>
//         manager.getClient(ctxPayload.tenantId),
//     });
//     moduleDefition.providers = providers;

//     const exports = moduleDefition.exports || [];
//     exports.push(PrismaService);
//     moduleDefition.exports = exports;

//     return moduleDefition;
//   }
// }

@Module({
  providers: [PrismaClientManager],
  exports: [PrismaClientManager],
})
export class PrismaMultiTenantModule extends PrismaMultiTenantModuleClass {}
