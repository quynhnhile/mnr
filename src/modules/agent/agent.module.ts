import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AGENT_REPOSITORY } from './agent.di-tokens';
import { CreateAgentHttpController } from './commands/create-agent/create-agent.http.controller';
import { CreateAgentService } from './commands/create-agent/create-agent.service';
import { DeleteAgentHttpController } from './commands/delete-agent/delete-agent.http.controller';
import { DeleteAgentService } from './commands/delete-agent/delete-agent.service';
import { UpdateAgentHttpController } from './commands/update-agent/update-agent.http.controller';
import { UpdateAgentService } from './commands/update-agent/update-agent.service';
import { PrismaAgentRepository } from './database/agent.repository.prisma';
import { AgentMapper } from './mappers/agent.mapper';
import { FindAgentHttpController } from './queries/find-agent/find-agent.http.controller';
import { FindAgentQueryHandler } from './queries/find-agent/find-agent.query-handler';
import { FindAgentsHttpController } from './queries/find-agents/find-agents.http.controller';
import { FindAgentsQueryHandler } from './queries/find-agents/find-agents.query-handler';

const httpControllers = [
  CreateAgentHttpController,
  FindAgentsHttpController,
  FindAgentHttpController,
  UpdateAgentHttpController,
  DeleteAgentHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateAgentService,
  UpdateAgentService,
  DeleteAgentService,
];

const queryHandlers: Provider[] = [
  FindAgentsQueryHandler,
  FindAgentQueryHandler,
];

const mappers: Provider[] = [AgentMapper];

const repositories: Provider[] = [
  {
    provide: AGENT_REPOSITORY,
    useClass: PrismaAgentRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class AgentModule {}
