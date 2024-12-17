import { RequestContextModule } from 'nestjs-request-context';
import { databaseConfig } from '@config/database.config';
import { keycloakConfig } from '@config/keycloak.config';
import { minioConfig } from '@config/minio.config';
import { ContextInterceptor } from '@libs/application/context/ContextInterceptor';
import { ExceptionInterceptor } from '@libs/application/interceptors/exception.interceptor';
import { KeycloakModule } from '@libs/keycloak/keycloak.module';
import { ELKLoggerService } from '@libs/logger/elk-logger.service';
import { MinioModule } from '@libs/minio/minio.module';
import { LOGGER_PORT } from '@libs/ports/logger.port';
import { PrismaMultiTenantModule } from '@libs/prisma/prisma-multi-tenant.module';
import { AgentModule } from '@modules/agent/agent.module';
import { AuthModule } from '@modules/auth/auth-module';
import { ClassifyModule } from '@modules/classify/classify.module';
import { CleanMethodModule } from '@modules/clean-method/clean-method.module';
import { CleanModeModule } from '@modules/clean-mode/clean-mode.module';
import { ComDamRepModule } from '@modules/com-dam-rep/com-dam-rep.module';
import { ComponentModule } from '@modules/component/component.module';
import { ConditionReeferModule } from '@modules/condition-reefer/condition-reefer.module';
import { ConditionModule } from '@modules/condition/condition.module';
import { ContSizeMapModule } from '@modules/cont-size-map/cont-size-map.module';
import { ContainerModule } from '@modules/container/container.module';
import { DamageLocalModule } from '@modules/damage-local/damage-local.module';
import { DamageModule } from '@modules/damage/damage.module';
import { EstimateModule } from '@modules/estimate/estimate.module';
import { GroupLocationLocalModule } from '@modules/group-location-local/group-location-local.module';
import { InfoContModule } from '@modules/info-cont/info-cont.module';
import { JobRepairCleanModule } from '@modules/job-repair-clean/job-repair-clean.module';
import { JobTaskModule } from '@modules/job-task/job-task.module';
import { LocalDmgDetailModule } from '@modules/local-dmg-detail/local-dmg-detail.module';
import { LocationModule } from '@modules/location/location.module';
import { OperationModule } from '@modules/operation/operation.module';
import { PayerModule } from '@modules/payer/payer.module';
import { RegionModule } from '@modules/region/region.module';
import { RepairContModule } from '@modules/repair-cont/repair-cont.module';
import { RepairModule } from '@modules/repair/repair.module';
import { ReportModule } from '@modules/report/report.module';
import { SurveyLocationModule } from '@modules/survey-location/survey-location.module';
import { SurveyModule } from '@modules/survey/survey.module';
import { SymbolModule } from '@modules/symbol/symbol.module';
import { SysConfigOprModule } from '@modules/sys-config-opr/sys-config-opr.module';
import { TariffGroupModule } from '@modules/tariff-group/tariff-group.module';
import { TariffModule } from '@modules/tariff/tariff.module';
import { TerminalModule } from '@modules/terminal/terminal.module';
import { UploadModule } from '@modules/upload/upload.module';
import { VendorTypeModule } from '@modules/vendor-type/vendor-type.module';
import { VendorModule } from '@modules/vendor/vendor.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { cacheConfig } from './configs/cache.config';
import { CacheModule } from './libs/cache/cache.module';
import { LocationLocalModule } from './modules/location-local/location-local.module';
import { ManageModule } from './modules/manage/manage.module';
import { MnrOverModule } from './modules/mnr-over/mnr-over.module';
import { SaModule } from './modules/sa/sa.module';
import { StatusTypeModule } from './modules/status-type/status-type.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestContextModule,
    CqrsModule,
    PrismaMultiTenantModule.forRootAsync({
      useFactory: async () => ({
        isGlobal: true,
        databaseUrl: databaseConfig.databaseUrl,
      }),
    }),
    KeycloakModule.forRootAsync({
      useFactory: async () => ({
        isGlobal: true,
        ...keycloakConfig,
      }),
    }),
    MinioModule.forRootAsync({
      useFactory: async () => ({ isGlobal: true, ...minioConfig }),
    }),

    CacheModule.forRootAsync({
      useFactory: async () => ({
        isGlobal: true,
        ...cacheConfig,
      }),
    }),

    UploadModule,
    // Business Modules
    AuthModule,
    SaModule,

    ClassifyModule,
    CleanMethodModule,
    CleanModeModule,
    ComDamRepModule,
    ComponentModule,
    ConditionModule,
    ContSizeMapModule,
    ContainerModule,
    DamageModule,
    EstimateModule,
    InfoContModule,
    JobRepairCleanModule,
    LocationModule,
    AgentModule,
    OperationModule,
    PayerModule,
    RepairModule,
    RepairContModule,
    ReportModule,
    ManageModule,
    SurveyModule,
    TariffGroupModule,
    VendorModule,
    VendorTypeModule,
    TariffModule,
    SurveyLocationModule,
    StatusTypeModule,
    MnrOverModule,
    SymbolModule,
    JobTaskModule,
    SysConfigOprModule,
    ConditionReeferModule,
    DamageLocalModule,
    GroupLocationLocalModule,
    LocationLocalModule,
    RegionModule,
    TerminalModule,
    LocalDmgDetailModule,
  ],
  controllers: [AppController],
  providers: [
    ...interceptors,
    {
      provide: LOGGER_PORT,
      useClass: ELKLoggerService,
    },
  ],
})
export class AppModule {}
