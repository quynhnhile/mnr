import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVendorTypeHttpController } from './commands/create-vendor-type/create-vendor-type.http.controller';
import { CreateVendorTypeService } from './commands/create-vendor-type/create-vendor-type.service';
import { DeleteVendorTypeHttpController } from './commands/delete-vendor-type/delete-vendor-type.http.controller';
import { DeleteVendorTypeService } from './commands/delete-vendor-type/delete-vendor-type.service';
import { UpdateVendorTypeHttpController } from './commands/update-vendor-type/update-vendor-type.http.controller';
import { UpdateVendorTypeService } from './commands/update-vendor-type/update-vendor-type.service';
import { PrismaVendorTypeRepository } from './database/vendor-type.repository.prisma';
import { VendorTypeMapper } from './mappers/vendor-type.mapper';
import { FindVendorTypeHttpController } from './queries/find-vendor-type/find-vendor-type.http.controller';
import { FindVendorTypeQueryHandler } from './queries/find-vendor-type/find-vendor-type.query-handler';
import { FindVendorTypesHttpController } from './queries/find-vendor-types/find-vendor-types.http.controller';
import { FindVendorTypesQueryHandler } from './queries/find-vendor-types/find-vendor-types.query-handler';
import { VENDOR_TYPE_REPOSITORY } from './vendor-type.di-tokens';

const httpControllers = [
  CreateVendorTypeHttpController,
  FindVendorTypesHttpController,
  FindVendorTypeHttpController,
  UpdateVendorTypeHttpController,
  DeleteVendorTypeHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateVendorTypeService,
  UpdateVendorTypeService,
  DeleteVendorTypeService,
];

const queryHandlers: Provider[] = [
  FindVendorTypesQueryHandler,
  FindVendorTypeQueryHandler,
];

const mappers: Provider[] = [VendorTypeMapper];

const repositories: Provider[] = [
  {
    provide: VENDOR_TYPE_REPOSITORY,
    useClass: PrismaVendorTypeRepository,
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
export class VendorTypeModule {}
