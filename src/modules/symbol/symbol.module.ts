import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SYMBOL_REPOSITORY } from './symbol.di-tokens';
import { CreateSymbolHttpController } from './commands/create-symbol/create-symbol.http.controller';
import { CreateSymbolService } from './commands/create-symbol/create-symbol.service';
import { DeleteSymbolHttpController } from './commands/delete-symbol/delete-symbol.http.controller';
import { DeleteSymbolService } from './commands/delete-symbol/delete-symbol.service';
import { UpdateSymbolHttpController } from './commands/update-symbol/update-symbol.http.controller';
import { UpdateSymbolService } from './commands/update-symbol/update-symbol.service';
import { PrismaSymbolRepository } from './database/symbol.repository.prisma';
import { SymbolMapper } from './mappers/symbol.mapper';
import { FindSymbolHttpController } from './queries/find-symbol/find-symbol.http.controller';
import { FindSymbolQueryHandler } from './queries/find-symbol/find-symbol.query-handler';
import { FindSymbolsHttpController } from './queries/find-symbols/find-symbols.http.controller';
import { FindSymbolsQueryHandler } from './queries/find-symbols/find-symbols.query-handler';

const httpControllers = [
  CreateSymbolHttpController,
  FindSymbolsHttpController,
  FindSymbolHttpController,
  UpdateSymbolHttpController,
  DeleteSymbolHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateSymbolService,
  UpdateSymbolService,
  DeleteSymbolService,
];

const queryHandlers: Provider[] = [
  FindSymbolsQueryHandler,
  FindSymbolQueryHandler,
];

const mappers: Provider[] = [SymbolMapper];

const repositories: Provider[] = [
  {
    provide: SYMBOL_REPOSITORY,
    useClass: PrismaSymbolRepository,
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
export class SymbolModule {}
