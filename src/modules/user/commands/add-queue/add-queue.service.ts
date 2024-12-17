import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { QueueService } from '@libs/queue/queue.service';
import { CommandHandler } from '@nestjs/cqrs';

export class AddQueueCommand {
  readonly userId: string;

  constructor(props: AddQueueCommand) {
    this.userId = props.userId;
  }
}

@CommandHandler(AddQueueCommand)
export class AddQueueUserService {
  constructor(private readonly queueService: QueueService) {}

  async execute(): Promise<Result<boolean, NotFoundException>> {
    try {
      // Add a job to the queue after user creation
      await this.queueService.addJob('default', 'sendWelcomeEmail', {
        userId: '1',
        email: 'test@gmail.com',
      });

      return Ok(true);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(error);
      }
      throw error;
    }
  }
}
