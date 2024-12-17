import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryContByContNosRequestDto {
  @ApiPropertyOptional({
    example: ['MSNU9695980', 'BSIU9329041'],
    description: 'container no',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  containerNo: string[];
}
