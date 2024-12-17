import { ApiProperty } from '@nestjs/swagger';

export class GetObjectInBucketResponseDto {
  @ApiProperty({
    example:
      'https://minio-ecm.cehcloud.net/snp/TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
    description: `URL ẢNH`,
  })
  urlImage: string;

  @ApiProperty({
    example:
      'TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
    description: `PATH`,
  })
  path: string;

  @ApiProperty({
    example: 'TEMU8121621_1.jpg',
    description: `TÊN ẢNH`,
  })
  nameImage: string;

  @ApiProperty({
    example: '',
    description: `THÔNG TIN ẢNH`,
  })
  infoImage: object;
}
