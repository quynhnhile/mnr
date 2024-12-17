import { JobsOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  private _queues: Map<string, Queue> = new Map();

  constructor(@InjectQueue('default') private readonly queue: Queue) {}

  getQueue(name: string): Queue {
    if (!this._queues.has(name)) {
      this._queues.set(name, this.queue);
    }
    return this._queues.get(name) as Queue<any>;
  }

  async addJob(
    queueName: string,
    jobName: string,
    data: unknown,
    options?: JobsOptions,
  ): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.add(jobName, data, options);
  }

  // async processJob(
  //   queueName: string,
  //   jobName: string,
  //   handler: (job: any) => Promise<any>,
  // ): Promise<void> {
  //   const queue = this.getQueue(queueName);
  //   await queue.process(jobName, handler);
  // }
}
