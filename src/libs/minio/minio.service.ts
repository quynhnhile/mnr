import * as Minio from 'minio';
import {
  BucketItemStat,
  CopyObjectResult,
} from 'minio/dist/main/internal/type';
import { Inject, Injectable } from '@nestjs/common';
import { MinioOptions } from './interfaces';
import { MINIO_OPTIONS } from './minio.module-definition';

@Injectable()
export class MinioService {
  private readonly _client: Minio.Client;
  private readonly _bucketName: string;

  constructor(@Inject(MINIO_OPTIONS) private _options: MinioOptions) {
    const { bucketName, ...restOptions } = _options;
    this._client = new Minio.Client(restOptions);
    this._bucketName = bucketName;
  }

  async checkOrCreateBucket(): Promise<void> {
    const exists = await this._client.bucketExists(this._bucketName);
    if (!exists) {
      await this._client.makeBucket(this._bucketName);
    }
  }

  async getListObject(prefix?: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const object: string[] = [];
      const rs = this._client.listObjects(this._bucketName, prefix, true);

      rs.on('data', (obj) => {
        object.push(obj.name ?? '');
      });

      rs.on('error', (err) => {
        reject(err);
      });

      rs.on('end', () => {
        resolve(object);
      });
    });
  }

  async getPresignedPutUrl(
    objectName: string,
    expiry?: number,
  ): Promise<string> {
    await this.checkOrCreateBucket();

    return this._client.presignedPutObject(
      this._bucketName,
      objectName,
      expiry,
    );
  }

  async getPresignedGetUrl(
    objectName: string,
    expiry?: number,
  ): Promise<string> {
    await this.checkOrCreateBucket();

    return this._client.presignedGetObject(
      this._bucketName,
      objectName,
      expiry,
    );
  }

  async getInfoObject(objectName: string): Promise<BucketItemStat> {
    return this._client.statObject(this._bucketName, objectName);
  }

  async copy({
    sourceObjectName,
    targetObjectName,
    conditions,
  }: {
    sourceObjectName: string;
    targetObjectName: string;
    conditions?: Minio.CopyConditions;
  }): Promise<CopyObjectResult> {
    await this.checkOrCreateBucket();

    return this._client.copyObject(
      this._bucketName,
      targetObjectName,
      `${this._bucketName}/${sourceObjectName}`,
      conditions,
    );
  }

  async move(
    sourceObjectName: string,
    targetObjectName: string,
    conditions?: Minio.CopyConditions,
  ): Promise<CopyObjectResult> {
    const copiedObjectResult = await this.copy({
      sourceObjectName,
      targetObjectName,
      conditions,
    });

    // if copy is successful, remove source object
    if (copiedObjectResult) {
      await this.remove(sourceObjectName);
    }

    return copiedObjectResult;
  }

  async remove(objectName: string): Promise<void> {
    await this._client.removeObject(this._bucketName, objectName);
  }

  async publicUrl(): Promise<void> {
    return this._client.setBucketPolicy(
      this._bucketName,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:GetObject'],
            Effect: 'Allow',
            Principal: '*',
            Resource: [`arn:aws:s3:::${this._bucketName.toLowerCase()}/*`],
          },
        ],
      }),
    );
  }

  async fGetObject(objectName: string, filePath: string): Promise<void> {
    await this._client.fGetObject(this._bucketName, objectName, filePath);
  }

  getPublicEndpoint(): string {
    // detect protocol
    const protocol = this._options.useSSL ? 'https' : 'http';

    // if useSSL is false, use port, otherwise use endpoint only
    const port = this._options.useSSL ? '' : `:${this._options.port}`;

    return `${protocol}://${this._options.endPoint}${port}`;
  }
}
