import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { SendWelcomeEmailWhenUserIsCreatedQueryHandler } from './send-welcome-email-when-user-is-created.query-handler';

@Processor('default')
export class UserQueueProcessorService extends WorkerHost {
  private readonly logger = new Logger(UserQueueProcessorService.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'sendWelcomeEmail': {
        new SendWelcomeEmailWhenUserIsCreatedQueryHandler().execute(job);
        break;
      }

      default: {
        this.logger.error(`Unknown job name: ${job.name}`);
        break;
      }
    }
  }
}
