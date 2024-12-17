import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

export class SendWelcomeEmailWhenUserIsCreatedQueryHandler {
  private readonly logger = new Logger(
    SendWelcomeEmailWhenUserIsCreatedQueryHandler.name,
  );

  async execute(job: Job<{ userId: string; email: string }>): Promise<void> {
    this.logger.debug(
      `Processing job ${job.id} with data ${JSON.stringify(job.data)}`,
    );

    const { userId, email } = job.data;

    // Implement your logic to send a welcome email
    this.logger.log(`Sending welcome email to user ${userId} at ${email}`);
    // You can add your email sending logic here
  }
}
