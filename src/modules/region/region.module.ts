import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateRegionHttpController } from './commands/create-region/create-region.http.controller';
import { CreateRegionService } from './commands/create-region/create-region.service';
import { DeleteRegionHttpController } from './commands/delete-region/delete-region.http.controller';
import { DeleteRegionService } from './commands/delete-region/delete-region.service';
import { UpdateRegionHttpController } from './commands/update-region/update-region.http.controller';
import { UpdateRegionService } from './commands/update-region/update-region.service';
import { PrismaRegionRepository } from './database/region.repository.prisma';
import { RegionMapper } from './mappers/region.mapper';
import { FindAllRegionsQueryHandler } from './queries/find-all-regions/find-all-regions.query-handler';
import { FindRegionHttpController } from './queries/find-region/find-region.http.controller';
import { FindRegionQueryHandler } from './queries/find-region/find-region.query-handler';
import { FindRegionsHttpController } from './queries/find-regions/find-regions.http.controller';
import { FindRegionsQueryHandler } from './queries/find-regions/find-regions.query-handler';
import { REGION_REPOSITORY } from './region.di-tokens';

const httpControllers = [
  CreateRegionHttpController,
  FindRegionsHttpController,
  FindRegionHttpController,
  UpdateRegionHttpController,
  DeleteRegionHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateRegionService,
  UpdateRegionService,
  DeleteRegionService,
];

const queryHandlers: Provider[] = [
  FindRegionsQueryHandler,
  FindRegionQueryHandler,
  FindAllRegionsQueryHandler,
];

const mappers: Provider[] = [RegionMapper];

const repositories: Provider[] = [
  {
    provide: REGION_REPOSITORY,
    useClass: PrismaRegionRepository,
  },
];

@Module({
  imports: [CqrsModule],
  exports: [REGION_REPOSITORY],
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
export class RegionModule {}
