import { QueryHandler } from '@nestjs/cqrs';
import { minioConfig } from '@src/configs/minio.config';
import { MinioService } from '@src/libs/minio/minio.service';
import { GetObjectInBucketResponseDto } from './get-object-in-bucket.response.dto';
export class GetObjectInBucketQuery {
  containerNo: string;
  idCont: string;
  jobTask: string;
  surveyType: string;
  seq: string;
  side: string;
  com: string;
  loc: string;
  dam: string;
  rep: string;
  length: string;
  width: string;
  quantity: string;

  constructor(
    public readonly cn: string,
    public readonly ic: string,
    public readonly jt: string,
    public readonly st: string,
    public readonly sq: string,
    public readonly sd: string,
    public readonly cm: string,
    public readonly lc: string,
    public readonly dm: string,
    public readonly rp: string,
    public readonly lg: string,
    public readonly wd: string,
    public readonly qt: string,
  ) {
    this.containerNo = cn;
    this.idCont = ic;
    this.jobTask = jt;
    this.surveyType = st;
    this.seq = sq;
    this.side = sd;
    this.com = cm;
    this.loc = lc;
    this.dam = dm;
    this.rep = rp;
    this.length = lg;
    this.width = wd;
    this.quantity = qt;
  }
}

@QueryHandler(GetObjectInBucketQuery)
export class GetObjectInBucketService {
  constructor(private readonly minIoService: MinioService) {}

  async execute(
    query: GetObjectInBucketQuery,
  ): Promise<GetObjectInBucketResponseDto[]> {
    const bucketName = minioConfig.bucketName;
    const minioHostGetImage = this.minIoService.getPublicEndpoint();

    const results: GetObjectInBucketResponseDto[] = [];

    if (
      query.containerNo &&
      !query.idCont &&
      !query.jobTask &&
      !query.surveyType &&
      !query.seq &&
      !query.side
    ) {
      const prefix = `${query.containerNo}_`;
      const rs = await this.minIoService.getListObject(prefix);

      for (let i = 0; i < rs.length; i++) {
        const path = rs[i];
        const infoImage = await this.minIoService.getInfoObject(path);
        const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
        const splitObject = rs[i].split('/');
        if (splitObject[1] == 'getin') {
          const nameImage = splitObject[4];
          results.push({ urlImage: result, nameImage, path, infoImage });
        } else {
          const nameImage = splitObject[3];
          results.push({ urlImage: result, nameImage, path, infoImage });
        }
      }
    } else if (
      query.idCont &&
      !query.jobTask &&
      !query.surveyType &&
      !query.seq &&
      !query.side
    ) {
      const contNoId = `${query.containerNo}_${query.idCont}/`;
      const rs = await this.minIoService.getListObject(contNoId);

      for (let i = 0; i < rs.length; i++) {
        const path = rs[i];
        const infoImage = await this.minIoService.getInfoObject(path);
        const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
        const splitObject = rs[i].split('/');
        if (splitObject[1] == 'getin') {
          const nameImage = splitObject[4];
          results.push({ urlImage: result, nameImage, path, infoImage });
        } else {
          const nameImage = splitObject[3];
          results.push({ urlImage: result, nameImage, path, infoImage });
        }
      }
    } else if (
      query.jobTask &&
      !query.surveyType &&
      !query.seq &&
      !query.side
    ) {
      if (!query.idCont) {
        return Promise.reject(new Error('idCont đang trống'));
      }
      const contNoId = `${query.containerNo}_${query.idCont}`;
      const prefix = `${contNoId}/${query.jobTask}/`;
      const rs = await this.minIoService.getListObject(prefix);

      for (let i = 0; i < rs.length; i++) {
        const path = rs[i];
        const infoImage = await this.minIoService.getInfoObject(path);
        const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
        const splitObject = rs[i].split('/');
        if (splitObject[1] == 'getin') {
          const nameImage = splitObject[4];
          results.push({ urlImage: result, nameImage, path, infoImage });
        } else {
          const nameImage = splitObject[3];
          results.push({ urlImage: result, nameImage, path, infoImage });
        }
      }
    } else if (query.surveyType && !query.seq && !query.side) {
      if (!query.idCont || !query.jobTask) {
        return Promise.reject(new Error('idCont hoặc jobTask đang trống'));
      }
      const contNoId = `${query.containerNo}_${query.idCont}`;
      const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_`;
      const rs = await this.minIoService.getListObject(prefix);

      for (let i = 0; i < rs.length; i++) {
        const path = rs[i];
        const infoImage = await this.minIoService.getInfoObject(path);
        const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
        const splitObject = rs[i].split('/');
        if (splitObject[1] == 'getin') {
          const nameImage = splitObject[4];
          results.push({ urlImage: result, nameImage, path, infoImage });
        } else {
          const nameImage = splitObject[3];
          results.push({ urlImage: result, nameImage, path, infoImage });
        }
      }
    } else if (query.seq && !query.side) {
      if (!query.surveyType || !query.jobTask || !query.idCont) {
        return Promise.reject(
          new Error('idCont, jobTask hoặc surveyType đang trống'),
        );
      }
      const contNoId = `${query.containerNo}_${query.idCont}`;
      const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_${query.seq}/`;
      const rs = await this.minIoService.getListObject(prefix);

      for (let i = 0; i < rs.length; i++) {
        const path = rs[i];
        const infoImage = await this.minIoService.getInfoObject(path);
        const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
        const splitObject = rs[i].split('/');
        if (splitObject[1] == 'getin') {
          const nameImage = splitObject[4];
          results.push({ urlImage: result, nameImage, path, infoImage });
        } else {
          const nameImage = splitObject[3];
          results.push({ urlImage: result, nameImage, path, infoImage });
        }
      }
    } else if (query.side) {
      if (!query.seq || !query.surveyType || !query.jobTask || !query.idCont) {
        return Promise.reject(
          new Error('idCont, jobTask, surveyType hoặc seq đang trống'),
        );
      }
      if (query.side == 'all') {
        const contNoId = `${query.containerNo}_${query.idCont}`;
        const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_${query.seq}/${query.side}/`;
        const rs = await this.minIoService.getListObject(prefix);

        for (let i = 0; i < rs.length; i++) {
          const path = rs[i];
          const infoImage = await this.minIoService.getInfoObject(path);
          const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
          const splitObject = rs[i].split('/');
          if (splitObject[1] == 'getin') {
            const nameImage = splitObject[4];
            results.push({ urlImage: result, nameImage, path, infoImage });
          } else {
            const nameImage = splitObject[3];
            results.push({ urlImage: result, nameImage, path, infoImage });
          }
        }
      }
      // nếu side == 'detail'
      else {
        if (!query.com) {
          return Promise.reject(new Error('com đang trống'));
        }
        if (
          query.com &&
          !query.loc &&
          !query.dam &&
          !query.rep &&
          !query.length &&
          !query.width &&
          !query.quantity
        ) {
          const contNoId = `${query.containerNo}_${query.idCont}`;
          const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_${query.seq}/${query.com}.`;
          const rs = await this.minIoService.getListObject(prefix);

          for (let i = 0; i < rs.length; i++) {
            const path = rs[i];
            const infoImage = await this.minIoService.getInfoObject(path);
            const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
            const splitObject = rs[i].split('/');
            if (splitObject[1] == 'getin') {
              const nameImage = splitObject[4];
              results.push({ urlImage: result, nameImage, path, infoImage });
            } else {
              const nameImage = splitObject[3];
              results.push({ urlImage: result, nameImage, path, infoImage });
            }
          }
        } else if (query.rep && !query.quantity) {
          const loc = query.loc || '-';
          const dam = query.dam || '-';
          const contNoId = `${query.containerNo}_${query.idCont}`;
          const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_${query.seq}/${query.com}.${loc}.${dam}.${query.rep}.`;
          const rs = await this.minIoService.getListObject(prefix);

          for (let i = 0; i < rs.length; i++) {
            const path = rs[i];
            const infoImage = await this.minIoService.getInfoObject(path);
            const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
            const splitObject = rs[i].split('/');
            if (splitObject[1] == 'getin') {
              const nameImage = splitObject[4];
              results.push({ urlImage: result, nameImage, path, infoImage });
            } else {
              const nameImage = splitObject[3];
              results.push({ urlImage: result, nameImage, path, infoImage });
            }
          }
        } else if (query.quantity) {
          if (!query.rep) {
            return Promise.reject(
              new Error('rep không được để trống khi quantity có giá trị'),
            );
          }
          const loc = query.loc || '-';
          const dam = query.dam || '-';
          const length = query.length || '-';
          const width = query.width || '-';
          const contNoId = `${query.containerNo}_${query.idCont}`;
          const prefix = `${contNoId}/${query.jobTask}/${query.surveyType}_${query.seq}/${query.com}.${loc}.${dam}.${query.rep}.${length}.${width}.${query.quantity}/`;
          const rs = await this.minIoService.getListObject(prefix);

          for (let i = 0; i < rs.length; i++) {
            const path = rs[i];
            const infoImage = await this.minIoService.getInfoObject(path);
            const result = `${minioHostGetImage}/${bucketName}/${rs[i]}`;
            const splitObject = rs[i].split('/');
            if (splitObject[1] == 'getin') {
              const nameImage = splitObject[4];
              results.push({ urlImage: result, nameImage, path, infoImage });
            } else {
              const nameImage = splitObject[3];
              results.push({ urlImage: result, nameImage, path, infoImage });
            }
          }
        }
      }
    }
    return results;
  }
}
