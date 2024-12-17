import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTerminalHttpController } from './commands/create-terminal/create-terminal.http.controller';
import { CreateTerminalService } from './commands/create-terminal/create-terminal.service';
import { DeleteTerminalHttpController } from './commands/delete-terminal/delete-terminal.http.controller';
import { DeleteTerminalService } from './commands/delete-terminal/delete-terminal.service';
import { UpdateTerminalHttpController } from './commands/update-terminal/update-terminal.http.controller';
import { UpdateTerminalService } from './commands/update-terminal/update-terminal.service';
import { PrismaTerminalRepository } from './database/terminal.repository.prisma';
import { TerminalMapper } from './mappers/terminal.mapper';
import { FindAllTerminalsQueryHandler } from './queries/find-all-terminals/find-all-terminals.query-handler';
import { FindTerminalHttpController } from './queries/find-terminal/find-terminal.http.controller';
import { FindTerminalQueryHandler } from './queries/find-terminal/find-terminal.query-handler';
import { FindTerminalsHttpController } from './queries/find-terminals/find-terminals.http.controller';
import { FindTerminalsQueryHandler } from './queries/find-terminals/find-terminals.query-handler';
import { TERMINAL_REPOSITORY } from './terminal.di-tokens';

const httpControllers = [
  CreateTerminalHttpController,
  FindTerminalsHttpController,
  FindTerminalHttpController,
  UpdateTerminalHttpController,
  DeleteTerminalHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateTerminalService,
  UpdateTerminalService,
  DeleteTerminalService,
];

const queryHandlers: Provider[] = [
  FindTerminalsQueryHandler,
  FindTerminalQueryHandler,
  FindAllTerminalsQueryHandler,
];

const mappers: Provider[] = [TerminalMapper];

const repositories: Provider[] = [
  {
    provide: TERMINAL_REPOSITORY,
    useClass: PrismaTerminalRepository,
  },
];

@Module({
  imports: [CqrsModule],
  exports: [TERMINAL_REPOSITORY],
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
export class TerminalModule {}
