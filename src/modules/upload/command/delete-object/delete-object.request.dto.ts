import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class DeleteObjectRequestDto {
  @ApiProperty({
    example:
      'TEMU8121621_CONT123456/getin/survey_0/HWR.TX7N.DT.RP.150.100.2/TEMU8121621_1.jpg',
    description: `PATH ẢNH`,
  })
  @IsNotEmpty()
  @MaxLength(200)
  path: string;
}
