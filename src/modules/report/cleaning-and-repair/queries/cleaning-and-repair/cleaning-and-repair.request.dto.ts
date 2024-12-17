import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportCleaningAndRepairRequestDto {
  @ApiPropertyOptional({
    example: 'E',
    description: 'Trạng thái',
  })
  @IsOptional()
  statusCode?: string;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Từ ngày',
  })
  @IsOptional()
  fromDate?: Date;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Đến ngày',
  })
  @IsOptional()
  toDate?: Date;

  @ApiPropertyOptional({
    example: '*',
    description: 'chủ kt',
  })
  @IsOptional()
  operationCode?: string;

  @ApiPropertyOptional({
    example: '*',
    description: 'Kích cỡ nội bộ',
  })
  @IsOptional()
  localSizeType?: string;

  @ApiPropertyOptional({
    example: '*',
    description: 'Phân loại tình trạng cont',
  })
  @IsOptional()
  conditionCode?: string;

  @ApiPropertyOptional({
    example: '*',
    description: 'loại cont',
  })
  @IsOptional()
  contType?: string;

  @ApiPropertyOptional({
    example: ['O'],
    description: 'Loại đối tượng thanh toán',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  payerCode: string[];
}
