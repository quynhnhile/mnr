import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CreateInfoContHttpController } from './commands/create-info-cont/create-info-cont.http.controller';
import { CreateInfoContService } from './commands/create-info-cont/create-info-cont.service';
import { DeleteInfoContHttpController } from './commands/delete-info-cont/delete-info-cont.http.controller';
import { DeleteInfoContService } from './commands/delete-info-cont/delete-info-cont.service';
import { UpdateInfoContHttpController } from './commands/update-info-cont/update-info-cont.http.controller';
import { UpdateInfoContService } from './commands/update-info-cont/update-info-cont.service';
import { PrismaInfoContRepository } from './database/info-cont.repository.prisma';
import { INFO_CONT_REPOSITORY } from './info-cont.di-tokens';
import { InfoContMapper } from './mappers/info-cont.mapper';
import { FindInfoContHttpController } from './queries/find-info-cont/find-info-cont.http.controller';
import { FindInfoContQueryHandler } from './queries/find-info-cont/find-info-cont.query-handler';
import { FindInfoContsHttpController } from './queries/find-info-conts/find-info-conts.http.controller';
import { FindInfoContsQueryHandler } from './queries/find-info-conts/find-info-conts.query-handler';
import { Validation } from '@src/libs/utils/validation';

const httpControllers = [
  CreateInfoContHttpController,
  FindInfoContsHttpController,
  FindInfoContHttpController,
  UpdateInfoContHttpController,
  DeleteInfoContHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateInfoContService,
  UpdateInfoContService,
  DeleteInfoContService,
];

const queryHandlers: Provider[] = [
  FindInfoContsQueryHandler,
  FindInfoContQueryHandler,
];

const mappers: Provider[] = [InfoContMapper];

const utils: Provider[] = [Validation];

const repositories: Provider[] = [
  {
    provide: INFO_CONT_REPOSITORY,
    useClass: PrismaInfoContRepository,
  },
];

@Module({
  imports: [CqrsModule, OperationModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
    ...utils,
  ],
  exports: [...repositories],
})
export class InfoContModule {}
