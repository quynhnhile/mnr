import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateSignedUrlHttpController } from './command/create-signed-url/create-signed-url.http.controller';
import { CreateSignedUrlService } from './command/create-signed-url/create-signed-url.service';
import { CONTAINER_REPOSITORY } from '../container/container.di-tokens';
import { PrismaContainerRepository } from '../container/database/container.repository.prisma';
import { ContainerMapper } from '../container/mappers/container.mapper';
import { PrismaSurveyRepository } from '../survey/database/survey.repository.prisma';
import { SURVEY_REPOSITORY } from '../survey/survey.di-tokens';
import { SurveyMapper } from '../survey/mappers/survey.mapper';
import { PrismaJobRepairCleanRepository } from '../job-repair-clean/database/job-repair-clean.repository.prisma';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '../job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanMapper } from '../job-repair-clean/mappers/job-repair-clean.mapper';
import { MoveObjectHttpController } from './command/move-object/move-object.http.controller';
import { MoveObjectService } from './command/move-object/move-object.service';
import { GetObjectInBucketHttpController } from './queries/get-object-in-bucket/get-object-in-bucket.http.controller';
import { GetObjectInBucketService } from './queries/get-object-in-bucket/get-object-in-bucket.service';
import { DeleteObjectHttpController } from './command/delete-object/delete-object.http.controller';
import { DeleteObjectService } from './command/delete-object/delete-object.service';

const httpControllers = [
  CreateSignedUrlHttpController,
  MoveObjectHttpController,
  GetObjectInBucketHttpController,
  DeleteObjectHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateSignedUrlService,
  MoveObjectService,
  GetObjectInBucketService,
  DeleteObjectService,
];

const queryHandlers: Provider[] = [];
const mappers: Provider[] = [
  ContainerMapper,
  SurveyMapper,
  JobRepairCleanMapper,
];
const repositories: Provider[] = [
  {
    provide: CONTAINER_REPOSITORY,
    useClass: PrismaContainerRepository,
  },
  {
    provide: SURVEY_REPOSITORY,
    useClass: PrismaSurveyRepository,
  },
  {
    provide: JOB_REPAIR_CLEAN_REPOSITORY,
    useClass: PrismaJobRepairCleanRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
  ],
  exports: [...repositories],
})
export class UploadModule {}
