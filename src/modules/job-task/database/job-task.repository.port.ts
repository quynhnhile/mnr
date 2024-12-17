import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { JobTaskEntity } from '../domain/job-task.entity';

export interface JobTaskRepositoryPort extends RepositoryPort<JobTaskEntity> {
  findOneByIdWithInUseCount(id: bigint): Promise<Option<JobTaskEntity>>;
}
