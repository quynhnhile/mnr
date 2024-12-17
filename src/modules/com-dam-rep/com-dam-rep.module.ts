import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ComponentModule } from '../component/component.module';
import { DamageModule } from '../damage/damage.module';
import { RepairModule } from '../repair/repair.module';
import { COM_DAM_REP_REPOSITORY } from './com-dam-rep.di-tokens';
import { CreateComDamRepHttpController } from './commands/create-com-dam-rep/create-com-dam-rep.http.controller';
import { CreateComDamRepService } from './commands/create-com-dam-rep/create-com-dam-rep.service';
import { DeleteComDamRepHttpController } from './commands/delete-com-dam-rep/delete-com-dam-rep.http.controller';
import { DeleteComDamRepService } from './commands/delete-com-dam-rep/delete-com-dam-rep.service';
import { UpdateComDamRepHttpController } from './commands/update-com-dam-rep/update-com-dam-rep.http.controller';
import { UpdateComDamRepService } from './commands/update-com-dam-rep/update-com-dam-rep.service';
import { PrismaComDamRepRepository } from './database/com-dam-rep.repository.prisma';
import { ComDamRepMapper } from './mappers/com-dam-rep.mapper';
import { FindComDamRepHttpController } from './queries/find-com-dam-rep/find-com-dam-rep.http.controller';
import { FindComDamRepQueryHandler } from './queries/find-com-dam-rep/find-com-dam-rep.query-handler';
import { FindComDamRepsHttpController } from './queries/find-com-dam-reps/find-com-dam-reps.http.controller';
import { FindComDamRepsQueryHandler } from './queries/find-com-dam-reps/find-com-dam-reps.query-handler';

const httpControllers = [
  CreateComDamRepHttpController,
  FindComDamRepsHttpController,
  FindComDamRepHttpController,
  UpdateComDamRepHttpController,
  DeleteComDamRepHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateComDamRepService,
  UpdateComDamRepService,
  DeleteComDamRepService,
];

const queryHandlers: Provider[] = [
  FindComDamRepsQueryHandler,
  FindComDamRepQueryHandler,
];

const mappers: Provider[] = [ComDamRepMapper];

const repositories: Provider[] = [
  {
    provide: COM_DAM_REP_REPOSITORY,
    useClass: PrismaComDamRepRepository,
  },
];

@Module({
  imports: [CqrsModule, ComponentModule, DamageModule, RepairModule],
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
export class ComDamRepModule {}
