import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OperationModule } from '../operation/operation.module';
import { CreateVendorHttpController } from './commands/create-vendor/create-vendor.http.controller';
import { CreateVendorService } from './commands/create-vendor/create-vendor.service';
import { DeleteVendorHttpController } from './commands/delete-vendor/delete-vendor.http.controller';
import { DeleteVendorService } from './commands/delete-vendor/delete-vendor.service';
import { UpdateVendorHttpController } from './commands/update-vendor/update-vendor.http.controller';
import { UpdateVendorService } from './commands/update-vendor/update-vendor.service';
import { PrismaVendorRepository } from './database/vendor.repository.prisma';
import { VendorMapper } from './mappers/vendor.mapper';
import { FindVendorHttpController } from './queries/find-vendor/find-vendor.http.controller';
import { FindVendorQueryHandler } from './queries/find-vendor/find-vendor.query-handler';
import { FindVendorsHttpController } from './queries/find-vendors/find-vendors.http.controller';
import { FindVendorsQueryHandler } from './queries/find-vendors/find-vendors.query-handler';
import { VENDOR_REPOSITORY } from './vendor.di-tokens';

const httpControllers = [
  CreateVendorHttpController,
  FindVendorsHttpController,
  FindVendorHttpController,
  UpdateVendorHttpController,
  DeleteVendorHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateVendorService,
  UpdateVendorService,
  DeleteVendorService,
];

const queryHandlers: Provider[] = [
  FindVendorsQueryHandler,
  FindVendorQueryHandler,
];

const mappers: Provider[] = [VendorMapper];

const repositories: Provider[] = [
  {
    provide: VENDOR_REPOSITORY,
    useClass: PrismaVendorRepository,
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
  ],
  exports: [...repositories],
})
export class VendorModule {}
