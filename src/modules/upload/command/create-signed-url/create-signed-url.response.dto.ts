import { ApiProperty } from '@nestjs/swagger';

export class CreateSignedUrlResponseDto {
  @ApiProperty({
    example: 1,
    description: `INDEX URL`,
  })
  indexUrl: number;

  @ApiProperty({
    example: 'snp/TEMU8121621_1/getin/survey_0/HWR.TX7N.DT.RP.150.100.2',
    description: `PATH`,
  })
  path: string;

  @ApiProperty({
    example: 'TEMU8121621_1.jpg',
    description: `TÊN ẢNH`,
  })
  name: string;

  @ApiProperty({
    example:
      'https://minio-ecm.cehcloud.net/snp/TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
    description: `LINK ẢNH`,
  })
  signedUrl: string;

  @ApiProperty({
    example:
      'https://minio-ecm.cehcloud.net/snp/TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
    description: `LINK GET ẢNH`,
  })
  imageUrl: string;
}
