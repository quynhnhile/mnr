import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: QueueModuleClass,
  ASYNC_OPTIONS_TYPE: QUEUE_ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TOKEN: QUEUE_OPTIONS,
} = new ConfigurableModuleBuilder<BullRootModuleOptions>()
  .setClassMethodName('forRoot')
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
