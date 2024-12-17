import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import {
  QUEUE_ASYNC_OPTIONS_TYPE,
  QueueModuleClass,
} from './queue.module-definition';
import { QueueService } from './queue.service';

@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule extends QueueModuleClass {
  static forRootAsync(options: typeof QUEUE_ASYNC_OPTIONS_TYPE): DynamicModule {
    const moduleDefinition = super.forRootAsync(options);

    // Add the default queue
    moduleDefinition.imports?.push(
      BullModule.forRootAsync({
        useFactory: options.useFactory,
      }),
      BullModule.registerQueueAsync({
        name: 'default',
        useFactory: () => ({
          name: 'default',
        }),
      }),
    );

    return moduleDefinition;
  }
}
