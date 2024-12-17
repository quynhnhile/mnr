import { RepositoryPort } from '@libs/ddd';
import { AgentEntity } from '../domain/agent.entity';

export type AgentRepositoryPort = RepositoryPort<AgentEntity>;
