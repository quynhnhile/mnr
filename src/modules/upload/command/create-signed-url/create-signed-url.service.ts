import { CommandHandler } from '@nestjs/cqrs';
import { CreateSignedUrlCommand } from './create-signed-url.command';
import { MinioService } from '@src/libs/minio/minio.service';
import { CreateSignedUrlResponseDto } from './create-signed-url.response.dto';
import { CacheService } from '@src/libs/cache/cache.service';
import { Inject } from '@nestjs/common';
import { CONTAINER_REPOSITORY } from '@src/modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@src/modules/container/database/container.repository.port';
import { Prisma } from '@prisma/client';
import { SurveyRepositoryPort } from '@src/modules/survey/database/survey.repository.port';
import { SURVEY_REPOSITORY } from '@src/modules/survey/survey.di-tokens';
import { JobRepairCleanRepositoryPort } from '@src/modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@src/modules/job-repair-clean/job-repair-clean.di-tokens';
import { minioConfig } from '@src/configs/minio.config';

@CommandHandler(CreateSignedUrlCommand)
export class CreateSignedUrlService {
  constructor(
    private readonly minIoService: MinioService,
    private readonly cacheService: CacheService,
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepo: ContainerRepositoryPort,
    @Inject(SURVEY_REPOSITORY)
    private readonly surveyRepo: SurveyRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    private readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: CreateSignedUrlCommand,
  ): Promise<CreateSignedUrlResponseDto[]> {
    const bucketName = minioConfig.bucketName;

    await this.minIoService.checkOrCreateBucket();
    const minioHostGetImage = this.minIoService.getPublicEndpoint();

    const { imageTotal } = command.getExtendedProps<CreateSignedUrlCommand>();
    const results: CreateSignedUrlResponseDto[] = [];

    //tìm tất cả container theo containerNo nhập vào
    const foundContByContNo =
      await this.containerRepo.findAll<Prisma.ContainerWhereInput>({
        where: {
          containerNo: command.containerNo,
        },
      });

    // tìm containerId mới nhất
    let containerId = BigInt(0);
    foundContByContNo.forEach((latestContainerId) => {
      if (latestContainerId.id > containerId) {
        containerId = latestContainerId.id;
      }
    });

    // tìm container theo containerId mới nhất
    const foundContByLatestId = await this.containerRepo.findOneById(
      containerId,
    );

    // tìm idCont mới nhất
    if (foundContByLatestId.isNone()) {
      return Promise.reject(new Error('Container not found'));
    }
    const foundIdCont = foundContByLatestId.unwrap();
    const idCont = foundIdCont.idCont;
    const contNoAndIdCont = `${command.containerNo}_${idCont}`;

    let seq = 0;

    // nếu loại tác nghiệp surveyType = survey
    if (command.surveyType == 'survey') {
      // tìm tất cả survey theo containerNo nhập vào và idCont tìm được ban đầu
      const foundAllSurveyByContNoAndIdCont =
        await this.surveyRepo.findSurveyByContNoAndIdCont({
          where: { containerNo: command.containerNo, idCont: idCont ?? '' },
        });
      seq = foundAllSurveyByContNoAndIdCont.length;
    }
    // nếu loại tác nghiệp surveyType = araise
    else if (command.surveyType == 'araise') {
      // tìm tất cả survey theo containerNo nhập vào và idCont tìm được ban đầu, thêm điều kiện có giá trị cột is_exception = true
      const foundAllSurveyByContNoAndIdContAndIsException =
        await this.surveyRepo.findSurveyByContNoAndIdContAndIsException({
          where: {
            containerNo: command.containerNo,
            idCont: idCont ?? '',
            isException: true,
          },
        });
      seq = foundAllSurveyByContNoAndIdContAndIsException.length + 1;
    }
    // nếu loại tác nghiệp surveyType = clean
    else if (command.surveyType == 'clean') {
      // tìm tất cả job repair clean có đánh dấu dòng vs is_clean == true theo containerNo nhập vào và idCont tìm được ban đầu
      const foundAllCleanByContNoAndIdCont =
        await this.jobRepairCleanRepo.findJobByContNoAndIdCont({
          where: {
            containerNo: command.containerNo,
            idCont: idCont ?? '',
            isClean: true,
          },
        });

      // tìm cột cancel_by
      const checkCancelBy = foundAllCleanByContNoAndIdCont.map((item) => {
        return item.cancelBy;
      });
      // tìm cột cancel_date
      const checkCancelDate = foundAllCleanByContNoAndIdCont.map((item) => {
        return item.cancelDate;
      });

      // nếu có tồn tại cột cancel_by hoặc cancel_date => error
      if (!checkCancelBy || !checkCancelDate) {
        return Promise.reject(new Error('Job repair clean has been canceled'));
      }
      // nếu không tồn tại cancel
      else {
        seq = foundAllCleanByContNoAndIdCont.length;
      }
    }
    //nếu loại tác nghiệp surveyType = repair
    else if (command.surveyType == 'repair') {
      // tìm tất cả job repair clean có đánh dấu dòng vs is_clean == false theo containerNo nhập vào và idCont tìm được ban đầu
      const foundAllRepairByContNoAndIdCont =
        await this.jobRepairCleanRepo.findJobByContNoAndIdCont({
          where: {
            containerNo: command.containerNo,
            idCont: idCont ?? '',
            isClean: false,
          },
        });

      // tìm cột cancel_by
      const checkCancelBy = foundAllRepairByContNoAndIdCont.map((item) => {
        return item.cancelBy;
      });
      // tìm cột cancel_date
      const checkCancelDate = foundAllRepairByContNoAndIdCont.map((item) => {
        return item.cancelDate;
      });

      // nếu có tồn tại cột cancel_by hoặc cancel_date => error
      if (!checkCancelBy || !checkCancelDate) {
        return Promise.reject(new Error('Job repair clean has been canceled'));
      }
      // nếu không tồn tại cancel
      else {
        seq = foundAllRepairByContNoAndIdCont.length;
      }
    }
    //nếu loại tác nghiệp surveyType = pti
    else if (command.surveyType == 'pti') {
      // pending pti......
    }

    if (command.jobTask == 'getin') {
      if (command.side == 'all') {
        const folderPath = [
          contNoAndIdCont,
          command.jobTask,
          `${command.surveyType}_${seq}`,
          command.side,
        ].join('/');
        const nameImage = `${command.containerNo}`;
        const keyNumber = `${bucketName}/${folderPath}/${nameImage}`;
        for (let i = 1; i <= imageTotal; i++) {
          const indexImage = await this.cacheService.incr(keyNumber);

          await this.minIoService.publicUrl();
          const url = await this.minIoService.getPresignedPutUrl(
            `${folderPath}/${nameImage}_${indexImage}.jpg`,
            24 * 60 * 60,
          );

          results.push({
            indexUrl: i,
            path: `${bucketName}/${folderPath}`,
            name: `${nameImage}_${indexImage}.jpg`,
            signedUrl: url,
            imageUrl: `${minioHostGetImage}/${keyNumber}_${indexImage}.jpg`,
          });
        }
      } else if (command.side == 'detail') {
        if (!command.com || !command.rep || !command.quantity) {
          return Promise.reject(
            new Error(
              'com, rep, quantity should not be empty when side is detail',
            ),
          );
        }

        const loc = command.loc || '-';
        const dam = command.dam || '-';
        const length = command.length || '-';
        const width = command.width || '-';
        const folderPath = [
          contNoAndIdCont,
          command.jobTask,
          `${command.surveyType}_${seq}`,
          `${command.com}.${loc}.${dam}.${command.rep}.${length}.${width}.${command.quantity}`,
        ].join('/');
        const nameImage = `${command.containerNo}`;
        const keyNumber = `${bucketName}/${folderPath}/${nameImage}`;
        for (let i = 1; i <= imageTotal; i++) {
          const indexImage = await this.cacheService.incr(keyNumber);

          await this.minIoService.publicUrl();
          const url = await this.minIoService.getPresignedPutUrl(
            `${folderPath}/${nameImage}_${indexImage}.jpg`,
            24 * 60 * 60,
          );

          results.push({
            indexUrl: i,
            path: `${bucketName}/${folderPath}`,
            name: `${nameImage}_${indexImage}.jpg`,
            signedUrl: url,
            imageUrl: `${minioHostGetImage}/${keyNumber}_${indexImage}.jpg`,
          });
        }
        //--------------------------------------------------
      }
    } else if (command.jobTask == 'getout') {
      if (command.side == 'all') {
        const folderPath = [
          contNoAndIdCont,
          command.jobTask,
          command.side,
        ].join('/');
        const nameImage = `${command.containerNo}`;
        const keyNumber = `${bucketName}/${folderPath}/${nameImage}`;
        for (let i = 1; i <= imageTotal; i++) {
          const indexImage = await this.cacheService.incr(keyNumber);

          await this.minIoService.publicUrl();
          const url = await this.minIoService.getPresignedPutUrl(
            `${folderPath}/${nameImage}_${indexImage}.jpg`,
            24 * 60 * 60,
          );

          results.push({
            indexUrl: i,
            path: `${bucketName}/${folderPath}`,
            name: `${nameImage}_${indexImage}.jpg`,
            signedUrl: url,
            imageUrl: `${minioHostGetImage}/${keyNumber}_${indexImage}.jpg`,
          });
        }
      } else if (command.side == 'detail') {
        if (!command.com || !command.rep || !command.quantity) {
          return Promise.reject(
            new Error(
              'com, rep, quantity should not be empty when side is detail',
            ),
          );
        }

        const loc = command.loc || '-';
        const dam = command.dam || '-';
        const length = command.length || '-';
        const width = command.width || '-';
        const folderPath = [
          contNoAndIdCont,
          command.jobTask,
          `${command.com}.${loc}.${dam}.${command.rep}.${length}.${width}.${command.quantity}`,
        ].join('/');
        const nameImage = `${command.containerNo}`;
        const keyNumber = `${bucketName}/${folderPath}/${nameImage}`;
        for (let i = 1; i <= imageTotal; i++) {
          const indexImage = await this.cacheService.incr(keyNumber);

          await this.minIoService.publicUrl();
          const url = await this.minIoService.getPresignedPutUrl(
            `${folderPath}/${nameImage}_${indexImage}.jpg`,
            24 * 60 * 60,
          );

          results.push({
            indexUrl: i,
            path: `${bucketName}/${folderPath}`,
            name: `${nameImage}_${indexImage}.jpg`,
            signedUrl: url,
            imageUrl: `${minioHostGetImage}/${keyNumber}_${indexImage}.jpg`,
          });
        }
      }
    }
    return results;
  }
}
